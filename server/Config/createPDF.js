const PDFDocument = require("pdfkit");

const createPDF = async (weatherData) => {
  // Create a PDF document
  const pdfDoc = new PDFDocument();
  // Pipe the PDF content to a buffer
  const pdfBuffer = await new Promise((resolve) => {
    const chunks = [];
    pdfDoc.on("data", (chunk) => {
      chunks.push(chunk);
    });
    pdfDoc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    // Add the weather data to the PDF
    pdfDoc.text(JSON.stringify(weatherData, null, 2));

    // End the PDF document
    pdfDoc.end();
  });
  return pdfBuffer;
};

module.exports = { createPDF };
