"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SearchOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Input, Modal, DatePicker, InputNumber, Button } from "antd";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

const SearchBar: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([
    null,
    null,
  ]);
  const [guests, setGuests] = useState<number | null>(null);

  const disabledDate = (current: Dayjs) => {
    // Disable all dates before today
    return current && current.isBefore(dayjs().startOf("day"));
  };

  const onSearch = () => {
    const query = new URLSearchParams();

    if (location) query.set("location", location);
    if (dates[0]) query.set("start_date", dates[0].format("YYYY-MM-DD"));
    if (dates[1]) query.set("end_date", dates[1].format("YYYY-MM-DD"));
    if (guests) query.set("guests", guests.toString());
    console.log(query.toString());
    router.push(query ? `/s?${query}` : "/s"); // 👈 if empty, just list all

    setIsModalOpen(false);
  };

  return (
    <div className="pb-4">
      {/* LARGE SCREENS */}
      <div className="hidden sm:flex bg-white p-2 border border-gray-200 shadow-xs rounded-xl">
        <div className="flex-1">
          <Input
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="!border-none !shadow-none focus:!shadow-none focus:!border-none"
          />
        </div>

        <div className="flex-1">
          <RangePicker
            format="ddd, MMM D"
            suffixIcon=""
            className="!border-none !shadow-none w-full [&>.ant-picker-suffix]:hidden"
            onChange={(values) =>
              setDates(values as [dayjs.Dayjs | null, dayjs.Dayjs | null])
            }
            disabledDate={disabledDate}
            placeholder={["Check-in", "Checkout"]}
          />
        </div>

        <div className="flex-1">
          <InputNumber
            min={1}
            value={guests}
            onChange={(value) => setGuests(value || 1)}
            className="!border-none !w-[150px] "
            placeholder="Add Guests"
          />
          <span className="text-gray-400 text-sm pl-4">
            {guests == null ? "" : guests === 1 ? "guest" : " guests"}
          </span>
        </div>

        <div className="">
          {" "}
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={onSearch}
            className="ml-3 bg-rose-500 hover:bg-rose-600 border-none font-medium"
          >
            Search
          </Button>
        </div>
      </div>

      <div className="sm:hidden px-4">
        <Button
          color="primary"
          block
          shape="round"
          icon={<SearchOutlined />}
          size="large"
          onClick={() => setIsModalOpen(true)}
          className="shadow-md bg-rose-500 hover:bg-rose-600 border-none"
        >
          <span className="text-gray-500">Search</span>
        </Button>
      </div>

      <Modal
        title="Search"
        open={isModalOpen}
        onOk={onSearch}
        onCancel={() => setIsModalOpen(false)}
        okText="Search"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 rounded-xl px-3 py-2">
            <Input
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className=" !shadow-none focus:!shadow-none focus:!border-none"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl px-3 py-2">
            <RangePicker
              format="ddd, MMM D"
              suffixIcon=""
              className="!border-none !shadow-none w-full [&>.ant-picker-suffix]:hidden"
              onChange={(values) =>
                setDates(values as [dayjs.Dayjs | null, dayjs.Dayjs | null])
              }
              disabledDate={disabledDate}
              placeholder={["Check-in", "Checkout"]}
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl px-3 py-2">
            <InputNumber
              min={1}
              value={guests}
              onChange={(value) => setGuests(value || 1)}
              className="!border-none !w-[150px] "
              placeholder="Add Guests"
            />
            <span className="text-gray-400 text-sm pl-4">
              {guests == null ? "" : guests === 1 ? "guest" : " guests"}
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SearchBar;
