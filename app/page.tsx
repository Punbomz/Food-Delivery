import { Suspense } from "react";
import PageClient from "./pageClient";
import Skeleton2 from "./components/Skeleton2";

export default function Page() {
  return (
    <Suspense fallback={<Skeleton2 />}>
      <PageClient />
    </Suspense>
  );
}
