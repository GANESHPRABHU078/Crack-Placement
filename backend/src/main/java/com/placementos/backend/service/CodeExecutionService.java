package com.placementos.backend.service;

import com.placementos.backend.dto.CodeExecutionRequest;
import com.placementos.backend.dto.CodeExecutionResponse;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class CodeExecutionService {

    public CodeExecutionResponse execute(CodeExecutionRequest request) {
        String lang = request.getLanguage();
        String code = request.getCode();
        
        try {
            Path tempDir = Files.createTempDirectory("exec_sandbox_");
            CodeExecutionResponse res = new CodeExecutionResponse();
            
            if ("java".equalsIgnoreCase(lang)) {
                res = executeJava(tempDir, code);
            } else if ("js".equalsIgnoreCase(lang) || "javascript".equalsIgnoreCase(lang)) {
                res = executeJs(tempDir, code);
            } else if ("python".equalsIgnoreCase(lang)) {
                res = executePython(tempDir, code);
            } else if ("cpp".equalsIgnoreCase(lang)) {
                res = executeCpp(tempDir, code);
            } else {
                return CodeExecutionResponse.builder()
                        .status("Runtime Error")
                        .stderr("Unsupported language: " + lang)
                        .executionTime("0ms")
                        .build();
            }
            
            // Clean up directory
            deleteDirectory(tempDir.toFile());
            return res;
        } catch (Exception e) {
            return CodeExecutionResponse.builder()
                    .status("Runtime Error")
                    .stderr("System Error: " + e.getMessage())
                    .executionTime("0ms")
                    .build();
        }
    }

    private CodeExecutionResponse executeJava(Path dir, String code) throws Exception {
        // 1. Write file
        File file = new File(dir.toFile(), "Main.java");
        try (FileWriter writer = new FileWriter(file)) {
            writer.write(code);
        }

        // 2. Compile
        ProcessBuilder pbCompile = new ProcessBuilder("javac", "Main.java");
        pbCompile.directory(dir.toFile());
        Process compileProc = pbCompile.start();
        boolean compiled = compileProc.waitFor(5, TimeUnit.SECONDS);

        if (!compiled || compileProc.exitValue() != 0) {
            compileProc.destroyForcibly();
            String stdErr = readStream(compileProc.getErrorStream());
            return CodeExecutionResponse.builder()
                    .status("Compile Error")
                    .stderr(stdErr.trim())
                    .executionTime("0ms")
                    .build();
        }

        // 3. Run
        return executeProcess(new ProcessBuilder("java", "Main"), dir.toFile());
    }
    
    private CodeExecutionResponse executeJs(Path dir, String code) throws Exception {
        File file = new File(dir.toFile(), "Main.js");
        try (FileWriter writer = new FileWriter(file)) {
            writer.write(code);
        }
        return executeProcess(new ProcessBuilder("node", "Main.js"), dir.toFile());
    }

    private CodeExecutionResponse executePython(Path dir, String code) throws Exception {
        File file = new File(dir.toFile(), "Main.py");
        try (FileWriter writer = new FileWriter(file)) {
            writer.write(code);
        }
        return executeProcess(new ProcessBuilder("python", "Main.py"), dir.toFile());
    }

    private CodeExecutionResponse executeCpp(Path dir, String code) throws Exception {
        File file = new File(dir.toFile(), "Main.cpp");
        try (FileWriter writer = new FileWriter(file)) {
            writer.write(code);
        }

        ProcessBuilder pbCompile = new ProcessBuilder("g++", "Main.cpp", "-o", "Main.exe");
        pbCompile.directory(dir.toFile());
        Process compileProc = pbCompile.start();
        boolean compiled = compileProc.waitFor(10, TimeUnit.SECONDS);

        if (!compiled || compileProc.exitValue() != 0) {
            compileProc.destroyForcibly();
            String stdErr = readStream(compileProc.getErrorStream());
            return CodeExecutionResponse.builder()
                    .status("Compile Error")
                    .stderr(stdErr.trim())
                    .executionTime("0ms")
                    .build();
        }

        // Run
        ProcessBuilder pbRun = new ProcessBuilder("Main.exe");
        // On Windows it's typically just "Main.exe", on unix "./Main.exe"
        if (System.getProperty("os.name").toLowerCase().contains("win")) {
            pbRun = new ProcessBuilder("cmd.exe", "/c", "Main.exe");
        } else {
            pbRun = new ProcessBuilder("./Main.exe");
        }
        return executeProcess(pbRun, dir.toFile());
    }

    private CodeExecutionResponse executeProcess(ProcessBuilder pb, File dir) throws Exception {
        pb.directory(dir);
        long startTime = System.currentTimeMillis();
        Process proc = pb.start();

        // 2 Second timeout
        boolean finished = proc.waitFor(3000, TimeUnit.MILLISECONDS);
        long runtime = System.currentTimeMillis() - startTime;

        if (!finished) {
            proc.destroyForcibly();
            return CodeExecutionResponse.builder()
                    .status("Time Limit Exceeded")
                    .executionTime(runtime + "ms")
                    .build();
        }

        String stdOut = readStream(proc.getInputStream());
        String stdErr = readStream(proc.getErrorStream());

        if (proc.exitValue() != 0) {
            return CodeExecutionResponse.builder()
                    .status("Runtime Error")
                    .stderr(stdErr.trim())
                    .executionTime(runtime + "ms")
                    .build();
        }

        return CodeExecutionResponse.builder()
                .status("Success")
                .stdout(stdOut)
                .executionTime(runtime + "ms")
                .build();
    }

    private String readStream(java.io.InputStream is) throws Exception {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            return reader.lines().collect(Collectors.joining("\n"));
        }
    }

    private boolean deleteDirectory(File dir) {
        File[] allContents = dir.listFiles();
        if (allContents != null) {
            for (File file : allContents) {
                deleteDirectory(file);
            }
        }
        return dir.delete();
    }
}
