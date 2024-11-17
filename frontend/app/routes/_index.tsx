import type { MetaFunction } from "@remix-run/node";
import { Copy, Paperclip } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import React, { useState, useRef, useEffect } from "react";
import UploadIcon from "../../public/assets/upload.png";
import RightBg from "../../public/assets/right-bg.svg?url";
import LeftBg from "../../public/assets/left-img.svg?url";
import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useFetcher } from "@remix-run/react";
export const meta: MetaFunction = () => {
  return [
    { title: "Qjs Pic" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

type FileListType = {
  id: number,
  url: string
}

export async function action({
  request,
}: ActionFunctionArgs) {
  const body = await request.formData();
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/upload`, {
    method: 'POST',
    body: body
  })

  if (!res.ok) {
    throw new Error(res.statusText)
  }
  const data = await res.json()
  return json(data)
}

export default function App() {
  const [list, setList] = useState<Array<FileListType>>([])
  const inputDom = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<any>();
  const [isDragging, setIsDragging] = useState(false);

  const fetcher = useFetcher();

  const handleFile = () => {
    inputDom.current?.click();
  }
  const dealUrlFormat = (payload: FileListType) => {
    if (payload.id === 2 && payload.url.startsWith('![](')) {
      return payload.url;
    }
    if (payload.id === 3 && payload.url.startsWith('<img')) {
      return payload.url;
    }

    const rawUrl = payload.url.replace(/!\[(.*?)\]\((.*?)\)/g, '$2')
      .replace(/<img.*?src="(.*?)".*?>/g, '$1');

    const urlObj: { [key: number]: string } = {
      1: `${rawUrl}`,
      2: `![](${rawUrl})`,
      3: `<img src="${rawUrl}" alt='qjs-pic' />`
    }
    return urlObj[payload.id]
  }

  const handleCopy = (item: { id: number, url: string }) => {
    const url = dealUrlFormat(item)
    if (navigator.clipboard) {
      toast.success('Copy successfully~', { duration: 1000 });
      navigator.clipboard.writeText(url);
    }
  };

  const getFile = async (file: File | Blob) => {
    try {
      if (!file) return;
      setFile(file);
      const formData = new FormData();
      formData.append('file', file);
      fetcher.submit(formData, {
        method: 'post',
        encType: 'multipart/form-data'
      });
    } catch (error) {

    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    if (file) {
      reset();
      getFile(file);
    }
  };

  const reset = () => {
    setFile(null);
    setList([]);
    setIsDragging(false);
    fetcher.load('/')
  }

  const ImgList: React.FC = () => {
    return (
      <div className="w-full flex flex-col gap-y-2 mt-4">
        {list.map((item: FileListType, idx) => (
          <div className="flex items-center justify-between mb-2 p-2 border border-dashed border-[#ED6C71]" key={idx}>
            <div className="whitespace-nowrap overflow-x-auto mr-2 text-[#ED6C71]">{dealUrlFormat(item)}</div>
            <Copy className="cursor-pointer text-[#ED6C71]" onClick={() => handleCopy(item)} />
          </div>
        ))}
      </div>
    )
  }

  useEffect(() => {
    const data = fetcher.data as any | undefined;
    if (data && fetcher.state === 'idle') {
      const { url } = data.params;

      setList(prevList => {
        const newItems = [];
        for (let i = 1; i <= 3; i++) {
          newItems.push({ id: i, url: dealUrlFormat({ id: i, url }) });
        }
        return [...prevList, ...newItems];
      });

      toast.success(data.message, { duration: 1000 });
    }
  }, [fetcher.state, fetcher.data]);

  useEffect(() => {
    window.addEventListener("paste", async (event) => {
      let items = event.clipboardData && event.clipboardData.items;
      let file: any = null;
      if (items && items.length) {
        for (var i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            file = items[i].getAsFile();
            break;
          }
        }
      }
      reset();
      await getFile(file);
    });

    inputDom.current?.addEventListener('change', async (event) => {
      const target = event.target as HTMLInputElement;
      const file = (target as any).files[0];
      if (file) {
        reset();
        await getFile(file);
      }
    })

    return () => reset();
  }, [])

  return (
    <div className="h-screen relative overflow-hidden">
      <div className="flex h-full items-center flex-col md:flex-row relative z-10">
        <div className="lg:w-1/2 w-full h-full relative flex items-center justify-center bg-slate-100 select-none">
          <div className="relative w-full sm:w-[550px] 2xl:w-[600px] h-[350px] select-none"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}>
            <img src={LeftBg} className="absolute -right-24 -top-20 w-40 h-40 hidden lg:block select-none pointer-events-none" alt="https://github.com/allmors/qjs" />
            {(file || isDragging) && (
              <div className="absolute bottom-1 left-1 w-full flex items-center text-[#ED6C71]">
                <Paperclip size={16} />
                <a href="https://github.com/allmors/qjs" className="ml-1 text-[#ED6C71] text-sm">{file?.name as string}</a>
              </div>
            )}
            <div className="flex flex-col items-center justify-center w-full h-full rounded-lg border border-[#ED6C71] border-dashed">
              <input ref={inputDom} hidden name="file" type="file" className="absolute top-0 left-0 opacity-0 cursor-pointer" />
              <img src={UploadIcon} alt="upload image" className="w-40 h-40 select-none pointer-events-none" />
              <p className="text-gray-500 leading-8">Drag and drop your file</p>
              <p className="text-gray-500 leading-8">or</p>
              <p className="text-gray-500 leading-8"><button aria-label="browser file" className="text-[#5794CF] cursor-pointer" onClick={handleFile}>Browser file</button></p>
            </div>
            {list.length > 0 && <ImgList />}
          </div>
        </div>
        <div className="sm:w-1/2 w-full h-full relative hidden lg:block bg-[#ED6C71]">
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 select-none pointer-events-none">
            <img src={RightBg} alt="https://github.com/allmors/qjs" className="select-none pointer-events-none" />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}