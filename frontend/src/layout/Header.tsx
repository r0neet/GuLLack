import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";

const Header = () => {
    const { theme, toggleTheme }: ReturnType<typeof useTheme> = useTheme();

    return (
        <div className="p-3 flex items-center justify-center">
            <button onClick={toggleTheme} className="px-2 py-2 rounded-lg  bg-indigo-100 text-indigo-500 dark:bg-[#1d1d1d]  dark:text-white">
                {theme === "dark" ? <Moon className="animate-pulse" strokeWidth={2} /> : <Sun className="animate-spin" strokeWidth={2} />}
            </button>
        </div>
    );
};

export default Header;
