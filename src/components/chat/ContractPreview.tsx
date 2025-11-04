"use client";

import { Contract, SERVICE_TYPE_KR } from "@/types/contract";

interface ContractPreviewProps {
  contract: Contract;
  isCustomerAgreed?: boolean;
  onCustomerAgreeChange?: (agreed: boolean) => void;
}

export default function ContractPreview({
  contract,
  isCustomerAgreed = false,
  onCustomerAgreeChange,
}: ContractPreviewProps) {
  return (
    <div
      id="contract-preview"
      style={{
        maxWidth: "56rem",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        padding: "2rem",
        fontSize: "0.875rem",
        lineHeight: "1.625",
        color: "#1f2937",
      }}
    >
      {/* 헤더 */}
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1
          style={{
            marginBottom: "0.5rem",
            fontSize: "1.875rem",
            fontWeight: "bold",
            color: "#1f2937",
          }}
        >
          이사 계약서
        </h1>
        <p style={{ color: "#6b7280" }}>Contract for Moving Services</p>
        <div
          style={{
            marginTop: "1rem",
            textAlign: "right",
            fontSize: "0.875rem",
            color: "#9ca3af",
          }}
        >
          계약번호: {contract.contractNumber}
        </div>
      </div>

      {/* 계약 당사자 */}
      <section style={{ marginBottom: "1.5rem" }}>
        <h2
          style={{
            marginBottom: "0.75rem",
            borderBottom: "2px solid #1f2937",
            paddingBottom: "0.25rem",
            fontSize: "1.125rem",
            fontWeight: "bold",
            color: "#1f2937",
          }}
        >
          제1조 (계약 당사자)
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div
            style={{
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              padding: "1rem",
            }}
          >
            <h3 style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#2563eb" }}>
              의뢰인 (갑)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <p style={{ color: "#374151" }}>
                <span style={{ fontWeight: "500" }}>성명:</span> {contract.customerName}
              </p>
              <p style={{ color: "#374151" }}>
                <span style={{ fontWeight: "500" }}>연락처:</span> {contract.customerPhone}
              </p>
              <p style={{ color: "#374151" }}>
                <span style={{ fontWeight: "500" }}>주소:</span> {contract.customerAddress}
              </p>
            </div>
          </div>
          <div
            style={{
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              padding: "1rem",
            }}
          >
            <h3 style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#16a34a" }}>
              이사업체 (을)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <p style={{ color: "#374151" }}>
                <span style={{ fontWeight: "500" }}>업체명:</span> {contract.driverNickname}
              </p>
              <p style={{ color: "#374151" }}>
                <span style={{ fontWeight: "500" }}>연락처:</span> {contract.driverPhone}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 이사 내역 */}
      <section style={{ marginBottom: "1.5rem" }}>
        <h2
          style={{
            marginBottom: "0.75rem",
            borderBottom: "2px solid #1f2937",
            paddingBottom: "0.25rem",
            fontSize: "1.125rem",
            fontWeight: "bold",
            color: "#1f2937",
          }}
        >
          제2조 (이사 내역)
        </h2>
        <div
          style={{
            borderRadius: "0.5rem",
            padding: "1rem",
            backgroundColor: "#f9fafb",
          }}
        >
          <table style={{ width: "100%" }}>
            <tbody>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td
                  style={{
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  이사 종류
                </td>
                <td style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem", color: "#374151" }}>
                  {SERVICE_TYPE_KR[contract.serviceType]}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td
                  style={{
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  이사 일자
                </td>
                <td style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem", color: "#374151" }}>
                  {contract.moveAt}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td
                  style={{
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  출발지
                </td>
                <td style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem", color: "#374151" }}>
                  {contract.departureAddress}
                  {contract.departureFloor !== undefined && (
                    <span style={{ marginLeft: "0.5rem", color: "#6b7280" }}>
                      ({contract.departureFloor}층,{" "}
                      {contract.departureElevator ? "엘리베이터 있음" : "엘리베이터 없음"})
                    </span>
                  )}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td
                  style={{
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  도착지
                </td>
                <td style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem", color: "#374151" }}>
                  {contract.arrivalAddress}
                  {contract.arrivalFloor !== undefined && (
                    <span style={{ marginLeft: "0.5rem", color: "#6b7280" }}>
                      ({contract.arrivalFloor}층,{" "}
                      {contract.arrivalElevator ? "엘리베이터 있음" : "엘리베이터 없음"})
                    </span>
                  )}
                </td>
              </tr>
              {contract.additionalRequirements && (
                <tr>
                  <td
                    style={{
                      paddingTop: "0.5rem",
                      paddingBottom: "0.5rem",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    추가 요청사항
                  </td>
                  <td style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem", color: "#374151" }}>
                    {contract.additionalRequirements}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 계약 금액 및 지불 조건 */}
      <section style={{ marginBottom: "1.5rem" }}>
        <h2
          style={{
            marginBottom: "0.75rem",
            borderBottom: "2px solid #1f2937",
            paddingBottom: "0.25rem",
            fontSize: "1.125rem",
            fontWeight: "bold",
            color: "#1f2937",
          }}
        >
          제3조 (계약 금액 및 지불 조건)
        </h2>
        <div
          style={{
            borderRadius: "0.5rem",
            padding: "1rem",
            backgroundColor: "#eff6ff",
          }}
        >
          <div
            style={{
              marginBottom: "0.75rem",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              borderBottom: "1px solid #bfdbfe",
              paddingBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1.125rem", fontWeight: "500", color: "#374151" }}>
              총 이사 비용
            </span>
            <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2563eb" }}>
              {contract.estimatedPrice.toLocaleString()}원
            </span>
          </div>
          {contract.depositAmount !== undefined && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
                fontSize: "0.875rem",
              }}
            >
              <p style={{ color: "#374151" }}>
                <span style={{ fontWeight: "500" }}>계약금:</span>{" "}
                {contract.depositAmount.toLocaleString()}원
              </p>
              <p style={{ color: "#374151" }}>
                <span style={{ fontWeight: "500" }}>잔금:</span>{" "}
                {(contract.estimatedPrice - contract.depositAmount).toLocaleString()}원
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 계약 조건 */}
      <section style={{ marginBottom: "1.5rem" }}>
        <br />
        <h2
          style={{
            marginBottom: "0.75rem",
            borderBottom: "2px solid #1f2937",
            paddingBottom: "0.25rem",
            fontSize: "1.125rem",
            fontWeight: "bold",
            color: "#1f2937",
          }}
        >
          제4조 (계약 조건)
        </h2>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem" }}
        >
          <p style={{ color: "#374151" }}>
            1. 을은 이사 당일 약속된 시간에 출발지에 도착하여 이사 작업을 개시하며, 갑의 물품을
            안전하게 운송할 의무가 있습니다.
          </p>
          <p style={{ color: "#374151" }}>
            2. 이사 작업 중 발생한 물품의 파손, 분실 등에 대해서는 을이 책임을 지며, 이에 대한 배상
            문제는 양 당사자 간 협의하여 해결합니다.
          </p>
          <p style={{ color: "#374151" }}>
            3. 천재지변이나 기타 불가항력적인 사유로 이사가 불가능할 경우, 양 당사자는 협의하여 이사
            날짜를 변경할 수 있습니다.
          </p>
          <p style={{ color: "#374151", fontWeight: "600" }}>4. 계약 해제 관련 약관</p>
          <p style={{ color: "#374151", paddingLeft: "1rem" }}>
            • 고객 계약 해제
            <br />
            &nbsp;&nbsp;- 이삿날 2일전까지 해제를 통지한 경우: 계약금의 배상
            <br />
            &nbsp;&nbsp;- 이삿날 당일에 해제를 통지한 경우: 계약금의 배액 배상
          </p>
          <p style={{ color: "#374151", paddingLeft: "1rem" }}>
            • 업체 계약 해제
            <br />
            &nbsp;&nbsp;- 이삿날 2일전까지 해제를 통지한 경우: 계약금의 배액 배상
            <br />
            &nbsp;&nbsp;- 이삿날 1일전까지 해제를 통지한 경우: 계약금의 4배액 배상
            <br />
            &nbsp;&nbsp;- 이삿날 당일에 해제를 통지한 경우: 계약금의 6배액 배상
            <br />
            &nbsp;&nbsp;- 이삿날 당일에도 해제를 통지를 하지 않은 경우: 계약금의 10배액 배상
          </p>
          {contract.cancellationPolicy && (
            <p
              style={{
                borderRadius: "0.25rem",
                padding: "0.5rem",
                backgroundColor: "#fefce8",
                color: "#374151",
              }}
            >
              <span style={{ fontWeight: "500" }}>취소 정책:</span> {contract.cancellationPolicy}
            </p>
          )}
        </div>
      </section>

      {/* 기타 사항 */}
      <section style={{ marginBottom: "1.5rem" }}>
        <h2
          style={{
            marginBottom: "0.75rem",
            borderBottom: "2px solid #1f2937",
            paddingBottom: "0.25rem",
            fontSize: "1.125rem",
            fontWeight: "bold",
            color: "#1f2937",
          }}
        >
          제5조 (기타 사항)
        </h2>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem" }}
        >
          <p style={{ color: "#374151" }}>
            1. 본 계약서에 명시되지 않은 사항은 양 당사자 간의 협의 및 관련 법령에 따라 처리합니다.
          </p>
          <p style={{ color: "#374151" }}>
            2. 본 계약과 관련하여 분쟁이 발생할 경우, 양 당사자는 우선적으로 상호 협의를 통해
            해결하도록 노력합니다.
          </p>
          <p style={{ color: "#374151" }}>
            3. 본 계약서는 전자문서 형태로 작성되며, 체결된 본 계약은 서면 계약관 동일한 법적 효력을
            갖습니다.
          </p>
        </div>
      </section>

      {/* 계약 일자 및 서명 */}
      <section style={{ marginTop: "2rem" }}>
        <div
          style={{
            marginBottom: "2rem",
            textAlign: "center",
            fontSize: "1rem",
            fontWeight: "500",
            color: "#1f2937",
          }}
        >
          계약일: {new Date(contract.contractedAt).toLocaleDateString("ko-KR")}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div
            style={{
              borderTop: "2px solid #1f2937",
              paddingTop: "1rem",
              textAlign: "center",
            }}
          >
            <p style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#1f2937" }}>
              의뢰인 (갑)
            </p>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>성명: {contract.customerName}</p>
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <input
                type="checkbox"
                id="customer-agreement"
                checked={isCustomerAgreed}
                onChange={(e) => onCustomerAgreeChange?.(e.target.checked)}
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  cursor: "pointer",
                  accentColor: "#2563eb",
                }}
              />
              <label
                htmlFor="customer-agreement"
                style={{
                  fontSize: "0.875rem",
                  color: "#374151",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                위 계약 내용에 동의합니다
              </label>
            </div>
          </div>
          <div
            style={{
              borderTop: "2px solid #1f2937",
              paddingTop: "1rem",
              textAlign: "center",
            }}
          >
            <p style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#1f2937" }}>
              이사업체 (을)
            </p>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              {contract.driverNickname}
            </p>
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <input
                type="checkbox"
                id="driver-agreement"
                checked={true}
                disabled={true}
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  cursor: "not-allowed",
                  accentColor: "#2563eb",
                  opacity: 0.6,
                }}
              />
              <label
                htmlFor="driver-agreement"
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  userSelect: "none",
                }}
              >
                위 계약 내용에 동의합니다
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 주의사항 */}
      <div
        style={{
          marginTop: "2rem",
          borderRadius: "0.5rem",
          border: "1px solid #fbbf24",
          padding: "1rem",
          fontSize: "0.75rem",
          backgroundColor: "#fefce8",
          color: "#6b7280",
        }}
      >
        <p style={{ marginBottom: "0.5rem", fontWeight: "600", color: "#92400e" }}>※ 주의사항</p>
        <ul
          style={{
            listStyleType: "disc",
            listStylePosition: "inside",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          <li>본 계약서는 법적 효력을 가지는 문서이므로 신중하게 확인하시기 바랍니다.</li>
          <li>계약서 내용을 충분히 확인하신 후 서명해주시기 바랍니다.</li>
          <li>계약 관련 문의사항이 있으시면 양 당사자에게 연락하시기 바랍니다.</li>
        </ul>
      </div>
    </div>
  );
}
