import Header from "@/layout/Header";

const Index = () => {
    return (
        <div className="bg-white dark:bg-black">
            <div className="h-screen grid place-content-center">
                <Header />
                <h1 className="lg:text-5xl text-2xl text-center font-bold text-black dark:text-white">
                    Welcome to <span className="text-indigo-500 dark:text-indigo-300">GuLLack</span>
                </h1>
                <p className="text-center text-gray-400 lg:mt-4">Project created by Roneet Bala</p>
            </div>
        </div>
    );
};

export default Index;
