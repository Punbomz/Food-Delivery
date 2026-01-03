import ContentWrapper from "@/app/components/ContentWrapper";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-base h-screen">
      <ContentWrapper>{children}</ContentWrapper>
    </div>
  );
}
