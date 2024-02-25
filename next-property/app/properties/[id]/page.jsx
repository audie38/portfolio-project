"use client";
import { useRouter, useParams, useSearchParams, usePathname } from "next/navigation";

const PropertyDynamic = () => {
  // [id] used for Dynamic URL
  // To Add Catch All Dynamic URL Path Rename the folder name to [...id]
  const router = useRouter();
  const { id } = useParams(); // get url parameter value
  const searchParams = useSearchParams(); // get url query parameter
  const name = searchParams.get("name");
  const pathName = usePathname(); // get url path

  return (
    <div>
      <button className="bg-blue-500 p-2" onClick={() => router.push("/")}>
        Go Home From {pathName} - {name} - {id}
      </button>
    </div>
  );
};

export default PropertyDynamic;
