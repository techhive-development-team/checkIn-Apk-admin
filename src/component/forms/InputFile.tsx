import { useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  label: string;
  name: string;
  required?: boolean;
  defaultImage?: string;
};

const InputFile = ({ label, name, required, defaultImage }: Props) => {
  const { control } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const clickUploadImage = () => {
    inputRef.current?.click();
  };

  const getPreviewUrl = (value?: File | null) => {
    if (value instanceof File) return URL.createObjectURL(value);
    return defaultImage || "";
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const previewUrl = getPreviewUrl(field.value);

        return (
          <div className="form-control w-full mb-4 flex flex-col">
            <label className="label">
              <span className="label-text font-semibold">
                {label}
                {required && !defaultImage && (
                  <span className="text-red-400 ml-1">*</span>
                )}
              </span>
            </label>

            <input
              ref={inputRef}
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                field.onChange(file);
              }}
              onBlur={field.onBlur}
            />

            {previewUrl ? (
              <label
                className="relative cursor-pointer rounded-lg border shadow p-2 flex justify-center items-center"
                title="Click to change photo"
                onClick={clickUploadImage}
              >
                <img
                  src={previewUrl}
                  alt="Selected"
                  className="max-h-40 object-contain"
                />
                <span className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow">
                  ✏️
                </span>
              </label>
            ) : (
              <label
                className="cursor-pointer border-dashed border-2 p-14 flex justify-center items-center rounded-lg text-gray-400"
                title="Click to upload photo"
                onClick={clickUploadImage}
              >
                <span>📷 Upload Image</span>
              </label>
            )}

            {fieldState.error && (
              <p className="text-red-500 text-sm mt-1">
                {fieldState.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};

export default InputFile;