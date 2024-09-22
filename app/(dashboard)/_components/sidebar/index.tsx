import { List } from "./list";
import { AddButton } from "./add-button";

export const Sidebar = () => {
	return (
		<aside className="fixed z-[1] left-0 bg-blue-950 h-full w-[60px] flex flex-col p-3 gap-y-4 text-white">
			<List />
			<AddButton />
		</aside>
	);
};