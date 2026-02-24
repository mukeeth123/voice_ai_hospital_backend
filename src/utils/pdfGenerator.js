import jsPDF from 'jspdf';

/**
 * Generates and downloads a medical report PDF.
 * @param {Object} data - Contains patientData, medicalReport, appointmentTime, doctorName
 */
export const generateAndDownloadPDF = (data) => {
    const { patientData, medicalReport, appointmentTime, doctorName } = data;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- Colors ---
    const primaryColor = [45, 108, 223]; // #2D6CDF
    const secondaryColor = [100, 116, 139]; // Slate-500
    const emergencyColor = [220, 38, 38]; // Red-600

    // --- Header ---
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Arogya AI Medical Report", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Advanced AI-Powered Hospital Assistant", pageWidth / 2, 30, { align: "center" });

    // --- Patient Details Section ---
    let yPos = 55;
    const leftMargin = 20;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Details", leftMargin, yPos);

    yPos += 8;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(`Name: ${patientData.name || 'N/A'}`, leftMargin, yPos);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, yPos);

    yPos += 7;
    doc.text(`Age/Gender: ${patientData.age || 'N/A'} / ${patientData.gender || 'N/A'}`, leftMargin, yPos);
    doc.text(`Phone: ${patientData.phone || 'N/A'}`, 150, yPos);

    // --- Vitals & Symptoms ---
    yPos += 15;
    doc.setDrawColor(200, 200, 200);
    doc.line(leftMargin, yPos - 5, pageWidth - leftMargin, yPos - 5);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Clinical Observations", leftMargin, yPos);

    yPos += 8;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Reported Symptoms: ${patientData.symptoms || 'None'}`, leftMargin, yPos);

    yPos += 7;
    doc.text(`Blood Pressure: ${patientData.bp || 'Not Recorded'}`, leftMargin, yPos);
    doc.text(`Blood Sugar: ${patientData.sugar || 'Not Recorded'}`, 110, yPos);

    // --- Medical Assessment ---
    yPos += 15;
    doc.line(leftMargin, yPos - 5, pageWidth - leftMargin, yPos - 5);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("AI Medical Assessment", leftMargin, yPos);

    yPos += 8;
    doc.setFontSize(11);
    doc.setTextColor(...secondaryColor);
    doc.text("Urgency Level:", leftMargin, yPos);

    const urgency = medicalReport.urgency_level || "Unknown";
    doc.setTextColor(...(urgency === 'High' || urgency === 'Critical' ? emergencyColor : [0, 128, 0]));
    doc.setFont("helvetica", "bold");
    doc.text(urgency, leftMargin + 30, yPos);

    yPos += 7;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Possible Conditions:", leftMargin, yPos);
    doc.setFont("helvetica", "normal");
    const conditions = Array.isArray(medicalReport.possible_conditions)
        ? medicalReport.possible_conditions.join(', ')
        : medicalReport.possible_conditions;
    doc.text(conditions, leftMargin + 45, yPos);

    yPos += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Explanation:", leftMargin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    const explanationLines = doc.splitTextToSize(medicalReport.explanation, pageWidth - (leftMargin * 2));
    doc.text(explanationLines, leftMargin, yPos);
    yPos += (explanationLines.length * 5) + 5;

    // --- Recommendations ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Recommendations", leftMargin, yPos);

    yPos += 7;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Consult Specialist: ${medicalReport.recommended_specialist}`, leftMargin, yPos);

    yPos += 7;
    const tests = Array.isArray(medicalReport.suggested_tests)
        ? medicalReport.suggested_tests.join(', ')
        : medicalReport.suggested_tests;
    doc.text(`Suggested Tests: ${tests}`, leftMargin, yPos);

    // Doctor Advice
    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Doctor's Advice:", leftMargin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    doc.setFont("helvetica", "italic");
    const adviceLines = doc.splitTextToSize(medicalReport.doctor_advice || "", pageWidth - (leftMargin * 2));
    doc.text(adviceLines, leftMargin, yPos);
    yPos += (adviceLines.length * 5) + 5;
    doc.setFont("helvetica", "normal");

    // Two Column Layout for Precautions & Lifestyle
    const col2X = pageWidth / 2 + 10;
    const startY = yPos;

    // Precautions
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 100, 0); // Orange
    doc.text("Precautions:", leftMargin, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    yPos += 5;
    (medicalReport.precautions || []).forEach(item => {
        const lines = doc.splitTextToSize(`• ${item}`, (pageWidth / 2) - 30);
        doc.text(lines, leftMargin, yPos);
        yPos += lines.length * 5;
    });

    // Lifestyle (Right Column)
    let yPos2 = startY;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 150, 0); // Green
    doc.text("Lifestyle Changes:", col2X, yPos2);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    yPos2 += 5;
    (medicalReport.lifestyle_recommendations || []).forEach(item => {
        const lines = doc.splitTextToSize(`• ${item}`, (pageWidth / 2) - 30);
        doc.text(lines, col2X, yPos2);
        yPos2 += lines.length * 5;
    });

    yPos = Math.max(yPos, yPos2) + 10;

    // Follow Up
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondaryColor);
    doc.text("Follow-up Steps:", leftMargin, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    yPos += 5;
    (medicalReport.follow_up_steps || []).forEach((item, i) => {
        doc.text(`${i + 1}. ${item}`, leftMargin, yPos);
        yPos += 6;
    });

    // Emergency Warning
    if (medicalReport.emergency_warning) {
        yPos += 10;
        doc.setTextColor(...emergencyColor);
        doc.setFont("helvetica", "bold");
        doc.text("EMERGENCY WARNING:", leftMargin, yPos);
        yPos += 6;
        doc.setFont("helvetica", "bold");
        const warnLines = doc.splitTextToSize(medicalReport.emergency_warning.toUpperCase(), pageWidth - (leftMargin * 2));
        doc.text(warnLines, leftMargin, yPos);
        yPos += warnLines.length * 6;
    }

    // --- Footer / Disclaimer ---
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    const disclaimer = medicalReport.disclaimer || "This is an AI-generated assessment. Please consult a doctor for a professional diagnosis.";
    doc.text(disclaimer, pageWidth / 2, pageHeight - 15, { align: "center" });

    // --- Save File ---
    const safeName = (patientData.name || 'Patient').replace(/\s+/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    doc.save(`Arogya_AI_Report_${safeName}_${dateStr}.pdf`);
};
