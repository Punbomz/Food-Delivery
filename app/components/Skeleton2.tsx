export default function Skeleton2() {
    return(
        <>
            <div className="flex min-h-screen w-full flex-col gap-6 p-10">

                {/* Header */}
                <div className="skeleton h-15 w-40 rounded-full"></div>

                {/* Card skeleton */}
                <div className="flex flex-col gap-4">
                    <div className="skeleton h-100 w-full rounded-xl"></div>

                    <div className="skeleton h-10 w-full"></div>
                    <div className="skeleton h-10 w-5/6"></div>
                    <div className="skeleton h-10 w-4/6"></div>
                </div>
            </div>
        </>
    );
}