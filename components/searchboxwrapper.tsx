"use client";

import dynamic from "next/dynamic";

// Dynamically import your SearchBox component with ssr disabled
const SearchBox = dynamic(() => import("./search_box"), {
  ssr: false,
});

export default function SearchBoxWrapper() {
  return <SearchBox />;
}
