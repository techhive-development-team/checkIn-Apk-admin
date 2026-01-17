import { useState } from "react";

type FormState<T> = {
  loading: boolean;
  success: boolean;
  message: string | string[];
  show: boolean;
  handleSubmit: (asyncFn: () => Promise<T>) => Promise<T>;
};

export const useFormState = <T = any>(): FormState<T> => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState<string | string[]>("");

  const handleSubmit = async (asyncFn: () => Promise<T>) => {
    setLoading(true);
    setShow(false);
    setMessage("");
    setSuccess(false);

    try {
      const response = await asyncFn();

      if ((response as any)?.statusCode === 200) {
        setSuccess(true);
        setMessage("Operation successful");
      } else if ((response as any)?.statusCode === 401) {
        setSuccess(false);
        setMessage("Please Log In Again");
      } else if ((response as any)?.statusCode === 400) {
        setSuccess(false);
        const data = (response as any)?.data;
        if (Array.isArray(data)) {
          setShow(true);
          setMessage(data.map((err: any) => err.message));
        } else {
          setMessage(data || "Invalid data");
        }
      } else {
        setSuccess(false);
        setMessage("Something went wrong");
      }

      return response;
    } catch (error: any) {
      setSuccess(false);
      console.error(error);
      setMessage(error?.response?.data || "Something went wrong");
      throw error;
    } finally {
      setShow(true);
      setLoading(false);
    }
  };

  return { loading, success, message, show, handleSubmit };
};
