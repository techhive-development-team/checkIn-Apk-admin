import { useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

export interface BaseResponse<T = any> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  meta?: any;
}

type FormState<T> = {
  loading: boolean;
  success: boolean;
  setSuccess: Dispatch<SetStateAction<boolean>>;
  setMessage: Dispatch<SetStateAction<string | string[]>>;
  setShow: Dispatch<SetStateAction<boolean>>;
  message: string | string[];
  show: boolean;
  handleSubmit: (asyncFn: () => Promise<BaseResponse<T>>) => Promise<BaseResponse<T>>;
};

export const useFormState = <T = any>(): FormState<T> => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState<string | string[]>("");

  const handleSubmit = async (asyncFn: () => Promise<BaseResponse<T>>) => {
    setLoading(true);
    setShow(false);
    setMessage("");
    setSuccess(false);

    try {
      const response = await asyncFn();

      switch (response.statusCode) {
        case 200:
        case 201:
          setSuccess(true);
          setMessage(response.message || "Operation successful");
          break;

        case 400:
          setSuccess(false);
          if (Array.isArray(response.data)) {
            setMessage(response.data.map((err: any) => err.message));
          } else {
            setMessage(response.message || "Invalid data");
          }
          break;

        case 401:
          setSuccess(false);
          setMessage(response.message || "Unauthorized access");
          navigate('/401')
          break;

        case 404:
          setSuccess(false);
          setMessage(response.message || "Resource not found");
          navigate('*')
          break;

        case 409:
          setSuccess(false);
          setMessage(response.message || "Conflict occurred");
          break;

        default:
          setSuccess(false);
          setMessage(response.message || "Something went wrong");
      }

      return response;
    } catch (error: any) {
      setSuccess(false);
      setMessage(error?.response?.data?.message || error?.message || "Something went wrong");
      throw error;
    } finally {
      setShow(true);
      setLoading(false);
    }
  };

  return { loading, success, message, show, setSuccess, setMessage, setShow, handleSubmit };
};
