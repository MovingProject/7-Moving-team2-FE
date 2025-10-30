import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * HTML 요소를 PDF로 변환하여 다운로드
 * @param elementId - PDF로 변환할 HTML 요소의 ID
 * @param fileName - 다운로드할 파일명 (확장자 제외)
 */
export async function downloadPDF(elementId: string, fileName: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    return;
  }

  try {
    // HTML을 캔버스로 변환
    const canvas = await html2canvas(element, {
      scale: 2, // 해상도 향상
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // jsPDF 인스턴스 생성
    const pdf = new jsPDF("p", "mm", "a4");
    let position = 0;

    // 첫 페이지 추가
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 여러 페이지가 필요한 경우 추가 페이지 생성
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // PDF 다운로드
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("PDF 생성 중 오류 발생:", error);
    throw error;
  }
}

/**
 * 현재 날짜를 기반으로 계약번호 생성
 * @returns 계약번호 (예: MOVE-2025-1028-001)
 */
export function generateContractNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `MOVE-${year}-${month}${day}-${random}`;
}
