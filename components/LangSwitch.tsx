"use client";

import { useState, useRef, Fragment, useEffect } from "react";
import {
  usePathname,
  useParams,
  useRouter,
  useSelectedLayoutSegments,
} from "next/navigation";
import siteMetadata from "@/data/siteMetadata";
import { Menu, Transition, RadioGroup } from "@headlessui/react";

const { languages } = siteMetadata;

const LangSwitch = () => {
  const urlSegments = useSelectedLayoutSegments();
  const router = useRouter();
  const params = useParams();
  const [locale, setLocal] = useState(params?.lng);


  const handleZhChange = () => {
    const newUrl = `/zh/${urlSegments.join("/")}`;
    router.push(newUrl);
  };
  const handleEnChange = () => {
    const newUrl = `/en/${urlSegments.join("/")}`;
    router.push(newUrl);
  };





  return (
    <div className="relative inline-block text-left ml-[50px]">
      <button className="mr-[50px]" onClick={handleZhChange}>zh</button>
      <button onClick={handleEnChange}>en</button>
    </div>
  );
};

export default LangSwitch;

