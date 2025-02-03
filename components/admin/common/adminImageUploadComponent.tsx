import { ChangeEvent } from "react";
import { useDispatch } from "react-redux";


export default function AdminFileUpload(props: any) {
    const title: string = props?.title ?? '';

    const dispatch = useDispatch();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target && event.target.files && event.target.files.length > 0) {
            const image = event.target.files[0];
        }
    };

    return (
        <div>
            {title}
            <input type="file" onChange={handleFileChange} />
        </div>
      );
}