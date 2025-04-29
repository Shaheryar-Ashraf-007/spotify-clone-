
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Outlet } from "react-router-dom"
import LeftSidebar from "./components/LeftSidebar"
const MainLayout = () => {

    const isMobile = false
  return (
    <div className="bg-black h-screen flex flex-col text-white">

        <ResizablePanelGroup direction="horizontal" className="flex-1 flex h-full overflow-hidden p-2">

            {/* left sidebar  */}


            <ResizablePanel defaultSize={20} minSize={isMobile ?0:10} maxSize={30}>

                <LeftSidebar/>

            </ResizablePanel>

            <ResizableHandle className="w-2 bg-black rounded-lg transition-colors"/>

            {/* main content  */}

            <ResizablePanel defaultSize={isMobile ?80:60}>
                <Outlet />
            </ResizablePanel>

            {/* Right sidebar  */}

            <ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
                Friends Activity

            </ResizablePanel>
        </ResizablePanelGroup>
        
    </div>
  )
}

export default MainLayout