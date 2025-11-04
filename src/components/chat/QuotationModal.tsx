"use client";

import { useState, useEffect } from "react";

interface RequestInfo {
  serviceType: string;
  moveAt: string;
  departureAddress: string;
  departureFloor: number;
  departurePyeong: number;
  departureElevator: boolean;
  arrivalAddress: string;
  arrivalFloor: number;
  arrivalPyeong: number;
  arrivalElevator: boolean;
  additionalRequirements?: string;
  previousQuotationId?: string;
  validUntil?: string;
}

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (price: number, message: string, requestInfo: RequestInfo) => void;
  initialRequestInfo?: Partial<RequestInfo>;
}

const SERVICE_TYPE_MAP: { [key: string]: string } = {
  SMALL_MOVE: "소형이사",
  HOME_MOVE: "가정이사",
  OFFICE_MOVE: "사무실 이사",
};

export default function QuotationModal({
  isOpen,
  onClose,
  onSend,
  initialRequestInfo,
}: QuotationModalProps) {
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  // 요청 정보 상태
  const [serviceType, setServiceType] = useState(initialRequestInfo?.serviceType || "HOME_MOVE");
  const [moveAt, setMoveAt] = useState(initialRequestInfo?.moveAt || "");
  const [departureAddress, setDepartureAddress] = useState(
    initialRequestInfo?.departureAddress || ""
  );
  const [departureFloor, setDepartureFloor] = useState(initialRequestInfo?.departureFloor || 1);
  const [departurePyeong, setDeparturePyeong] = useState(initialRequestInfo?.departurePyeong || 20);
  const [departureElevator, setDepartureElevator] = useState(
    initialRequestInfo?.departureElevator ?? true
  );
  const [arrivalAddress, setArrivalAddress] = useState(initialRequestInfo?.arrivalAddress || "");
  const [arrivalFloor, setArrivalFloor] = useState(initialRequestInfo?.arrivalFloor || 1);
  const [arrivalPyeong, setArrivalPyeong] = useState(initialRequestInfo?.arrivalPyeong || 20);
  const [arrivalElevator, setArrivalElevator] = useState(
    initialRequestInfo?.arrivalElevator ?? true
  );
  const [additionalRequirements, setAdditionalRequirements] = useState(
    initialRequestInfo?.additionalRequirements || ""
  );

  // initialRequestInfo가 변경될 때마다 상태 업데이트
  useEffect(() => {
    if (initialRequestInfo) {
      if (initialRequestInfo.serviceType) setServiceType(initialRequestInfo.serviceType);
      if (initialRequestInfo.moveAt) setMoveAt(initialRequestInfo.moveAt);
      if (initialRequestInfo.departureAddress)
        setDepartureAddress(initialRequestInfo.departureAddress);
      if (initialRequestInfo.departureFloor !== undefined)
        setDepartureFloor(initialRequestInfo.departureFloor);
      if (initialRequestInfo.departurePyeong !== undefined)
        setDeparturePyeong(initialRequestInfo.departurePyeong);
      if (initialRequestInfo.departureElevator !== undefined)
        setDepartureElevator(initialRequestInfo.departureElevator);
      if (initialRequestInfo.arrivalAddress) setArrivalAddress(initialRequestInfo.arrivalAddress);
      if (initialRequestInfo.arrivalFloor !== undefined)
        setArrivalFloor(initialRequestInfo.arrivalFloor);
      if (initialRequestInfo.arrivalPyeong !== undefined)
        setArrivalPyeong(initialRequestInfo.arrivalPyeong);
      if (initialRequestInfo.arrivalElevator !== undefined)
        setArrivalElevator(initialRequestInfo.arrivalElevator);
      setAdditionalRequirements(initialRequestInfo.additionalRequirements || "");
    }
  }, [initialRequestInfo]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseInt(price);
    if (!priceNum || priceNum <= 0) {
      alert("올바른 견적 금액을 입력해주세요.");
      return;
    }

    const requestInfo: RequestInfo = {
      serviceType,
      moveAt,
      departureAddress,
      departureFloor,
      departurePyeong,
      departureElevator,
      arrivalAddress,
      arrivalFloor,
      arrivalPyeong,
      arrivalElevator,
      additionalRequirements: additionalRequirements || undefined,
    };

    onSend(priceNum, message, requestInfo);
    setPrice("");
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">견적 보내기</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 요청 내역 섹션 */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 text-sm font-bold text-gray-700">요청 내역</h3>

            {/* 이사 종류 */}
            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-gray-600">이사 종류</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="SMALL_MOVE">소형이사</option>
                <option value="HOME_MOVE">가정이사</option>
                <option value="OFFICE_MOVE">사무실 이사</option>
              </select>
            </div>

            {/* 이사 일자 */}
            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-gray-600">이사 일자</label>
              <input
                type="date"
                value={moveAt}
                onChange={(e) => setMoveAt(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* 출발지 */}
            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-gray-600">출발지</label>
              <input
                type="text"
                value={departureAddress}
                onChange={(e) => setDepartureAddress(e.target.value)}
                placeholder="서울특별시 강남구 테헤란로 123"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div>
                  <label className="mb-1 block text-xs text-gray-500">층수</label>
                  <input
                    type="number"
                    value={departureFloor}
                    onChange={(e) => setDepartureFloor(parseInt(e.target.value) || 1)}
                    className="w-full rounded border px-2 py-1 text-sm"
                    min="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">평수</label>
                  <input
                    type="number"
                    value={departurePyeong}
                    onChange={(e) => setDeparturePyeong(parseFloat(e.target.value) || 20)}
                    className="w-full rounded border px-2 py-1 text-sm"
                    min="1"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">엘리베이터</label>
                  <select
                    value={departureElevator ? "true" : "false"}
                    onChange={(e) => setDepartureElevator(e.target.value === "true")}
                    className="w-full rounded border px-2 py-1 text-sm"
                  >
                    <option value="true">있음</option>
                    <option value="false">없음</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 도착지 */}
            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-gray-600">도착지</label>
              <input
                type="text"
                value={arrivalAddress}
                onChange={(e) => setArrivalAddress(e.target.value)}
                placeholder="서울특별시 송파구 중앙로 23"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div>
                  <label className="mb-1 block text-xs text-gray-500">층수</label>
                  <input
                    type="number"
                    value={arrivalFloor}
                    onChange={(e) => setArrivalFloor(parseInt(e.target.value) || 1)}
                    className="w-full rounded border px-2 py-1 text-sm"
                    min="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">평수</label>
                  <input
                    type="number"
                    value={arrivalPyeong}
                    onChange={(e) => setArrivalPyeong(parseFloat(e.target.value) || 20)}
                    className="w-full rounded border px-2 py-1 text-sm"
                    min="1"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">엘리베이터</label>
                  <select
                    value={arrivalElevator ? "true" : "false"}
                    onChange={(e) => setArrivalElevator(e.target.value === "true")}
                    className="w-full rounded border px-2 py-1 text-sm"
                  >
                    <option value="true">있음</option>
                    <option value="false">없음</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 추가 요청사항 */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">추가 요청사항</label>
              <textarea
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                placeholder="사다리차 사용 불가"
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 견적 금액 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">견적 금액 (원)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="예: 250000"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* 메시지 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">메시지 (선택)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="견적에 대한 추가 설명을 입력하세요"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            >
              전송
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
