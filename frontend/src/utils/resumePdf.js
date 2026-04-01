const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 50;
const MARGIN_TOP = 56;
const MARGIN_BOTTOM = 48;

const normalizeText = (value = '') =>
  String(value)
    .replace(/\r/g, '')
    .replace(/[\u2022•]/g, '-')
    .replace(/â€¢/g, '-')
    .replace(/[^\x20-\x7E\n]/g, ' ')
    .trim();

const escapePdfText = (value) =>
  normalizeText(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

const wrapText = (text, maxWidth, fontSize) => {
  const normalized = normalizeText(text);
  if (!normalized) return [''];

  const approxCharWidth = fontSize * 0.5;
  const maxChars = Math.max(12, Math.floor(maxWidth / approxCharWidth));
  const words = normalized.split(/\s+/);
  const lines = [];
  let current = '';

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
      return;
    }

    if (current) {
      lines.push(current);
      current = '';
    }

    if (word.length <= maxChars) {
      current = word;
      return;
    }

    let remainder = word;
    while (remainder.length > maxChars) {
      lines.push(remainder.slice(0, maxChars - 1));
      remainder = remainder.slice(maxChars - 1);
    }
    current = remainder;
  });

  if (current) {
    lines.push(current);
  }

  return lines;
};

const buildPdf = (pages) => {
  const pageCount = pages.length;
  const objects = [];
  const pageRefs = [];

  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';

  let objectIndex = 5;

  pages.forEach((pageContent) => {
    const contentId = objectIndex;
    const pageId = objectIndex + 1;
    const stream = pageContent.join('\n');
    const streamLength = new TextEncoder().encode(stream).length;

    objects[contentId] = `<< /Length ${streamLength} >>\nstream\n${stream}\nendstream`;
    objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`;
    pageRefs.push(`${pageId} 0 R`);
    objectIndex += 2;
  });

  objects[2] = `<< /Type /Pages /Count ${pageCount} /Kids [${pageRefs.join(' ')}] >>`;

  let pdf = '%PDF-1.4\n';
  const offsets = ['0000000000 65535 f '];

  for (let i = 1; i < objects.length; i += 1) {
    const offset = pdf.length;
    offsets[i] = `${String(offset).padStart(10, '0')} 00000 n `;
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += `${offsets.join('\n')}\n`;
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
};

export const downloadResumePdf = (resume, template = 'classic') => {
  const pages = [[]];
  let currentPage = pages[0];
  let y = PAGE_HEIGHT - MARGIN_TOP;

  const ensureSpace = (neededHeight) => {
    if (y - neededHeight >= MARGIN_BOTTOM) {
      return;
    }
    currentPage = [];
    pages.push(currentPage);
    y = PAGE_HEIGHT - MARGIN_TOP;
  };

  const addLine = (text, options = {}) => {
    const {
      size = 11,
      bold = false,
      x = MARGIN_X,
      gapAfter = 3,
    } = options;

    ensureSpace(size + gapAfter);
    currentPage.push(`BT /F${bold ? '2' : '1'} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${escapePdfText(text)}) Tj ET`);
    y -= size + gapAfter;
  };

  const addWrappedText = (text, options = {}) => {
    const {
      size = 11,
      bold = false,
      x = MARGIN_X,
      width = PAGE_WIDTH - (MARGIN_X * 2),
      lineGap = 2,
      gapAfter = 4,
    } = options;

    const lines = wrapText(text, width, size);
    ensureSpace(lines.length * (size + lineGap) + gapAfter);
    lines.forEach((line) => {
      currentPage.push(`BT /F${bold ? '2' : '1'} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${escapePdfText(line)}) Tj ET`);
      y -= size + lineGap;
    });
    y -= gapAfter;
  };

  const addSectionTitle = (title) => {
    addLine(title.toUpperCase(), { size: 12, bold: true, gapAfter: 6 });
    currentPage.push(`0.6 w ${MARGIN_X} ${y + 2} m ${PAGE_WIDTH - MARGIN_X} ${y + 2} l S`);
    y -= 8;
  };

  const addBulletLines = (text) => {
    const lines = normalizeText(text)
      .split('\n')
      .map((line) => line.replace(/^[-*]\s*/, '').trim())
      .filter(Boolean);

    lines.forEach((line) => {
      const wrapped = wrapText(line, PAGE_WIDTH - (MARGIN_X * 2) - 18, 10.5);
      ensureSpace(wrapped.length * 12 + 2);
      wrapped.forEach((wrappedLine, index) => {
        const prefix = index === 0 ? '- ' : '  ';
        currentPage.push(`BT /F1 10.5 Tf 1 0 0 1 ${MARGIN_X + 10} ${y} Tm (${escapePdfText(`${prefix}${wrappedLine}`)}) Tj ET`);
        y -= 12;
      });
      y -= 1;
    });
  };

  const isModern = template === 'modern';
  const isCompact = template === 'compact';

  addLine(resume.personal.name || 'Your Name', {
    size: isCompact ? 18 : 20,
    bold: true,
    x: isModern || isCompact ? MARGIN_X : 170,
    gapAfter: 8
  });

  const contactParts = [
    resume.personal.phone,
    resume.personal.email,
    resume.personal.linkedin,
    resume.personal.github,
  ].filter(Boolean);

  if (contactParts.length) {
    addWrappedText(contactParts.join(' | '), {
      size: isCompact ? 9.5 : 10.5,
      x: isModern || isCompact ? MARGIN_X : 100,
      width: isModern || isCompact ? PAGE_WIDTH - (MARGIN_X * 2) : 395,
      gapAfter: 10
    });
  }

  if (resume.education.some((item) => item.school || item.degree)) {
    addSectionTitle('Education');
    resume.education.forEach((edu) => {
      if (!edu.school && !edu.degree) return;
      addWrappedText(`${edu.school || ''}${edu.location ? `    ${edu.location}` : ''}`, { size: 11.5, bold: true, gapAfter: 0 });
      addWrappedText(`${edu.degree || ''}${edu.date ? `    ${edu.date}` : ''}`, { size: 10.5, gapAfter: 1 });
      if (edu.gpa) addLine(`GPA: ${edu.gpa}`, { size: 10.5, gapAfter: 6 });
      else y -= 4;
    });
  }

  if (resume.experience.some((item) => item.company || item.role)) {
    addSectionTitle('Experience');
    resume.experience.forEach((exp) => {
      if (!exp.company && !exp.role) return;
      addWrappedText(`${exp.role || ''}${exp.date ? `    ${exp.date}` : ''}`, { size: 11.5, bold: true, gapAfter: 0 });
      addWrappedText(`${exp.company || ''}${exp.location ? `    ${exp.location}` : ''}`, { size: 10.5, gapAfter: 3 });
      addBulletLines(exp.desc || '');
      y -= 4;
    });
  }

  if (resume.projects.some((item) => item.name || item.tech)) {
    addSectionTitle('Projects');
    resume.projects.forEach((project) => {
      if (!project.name && !project.tech) return;
      const heading = [project.name, project.tech ? `| ${project.tech}` : '', project.date ? `    ${project.date}` : '']
        .filter(Boolean)
        .join(' ');
      addWrappedText(heading, { size: 11.5, bold: true, gapAfter: 3 });
      addBulletLines(project.desc || '');
      y -= 4;
    });
  }

  if (resume.skills.languages || resume.skills.frameworks || resume.skills.tools) {
    addSectionTitle('Technical Skills');
    if (resume.skills.languages) addWrappedText(`Languages: ${resume.skills.languages}`, { size: 10.5, gapAfter: 1 });
    if (resume.skills.frameworks) addWrappedText(`Frameworks: ${resume.skills.frameworks}`, { size: 10.5, gapAfter: 1 });
    if (resume.skills.tools) addWrappedText(`Developer Tools: ${resume.skills.tools}`, { size: 10.5, gapAfter: 1 });
  }

  if (Array.isArray(resume.customSections)) {
    resume.customSections
      .filter((section) => (section.title || '').trim() || (section.content || '').trim())
      .forEach((section) => {
        addSectionTitle(section.title || 'Additional Information');
        addBulletLines(section.content || '');
        y -= 4;
      });
  }

  const blob = buildPdf(pages);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${normalizeText(resume.personal.name || 'resume').replace(/\s+/g, '_').toLowerCase()}.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
};
