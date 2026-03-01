import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Reports() {

  const downloadPDF = async () => {
    const element = document.body;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    pdf.save("report.pdf");
  };

  return (
    <div className="page">
      <h2>Reports</h2>

      <button onClick={downloadPDF}>
        Download PDF Report
      </button>
    </div>
  );
}

export default Reports;