import { Button, Form, Image } from "antd";
import { useWatch } from "antd/es/form/Form";
import Dragger from "antd/es/upload/Dragger";
import clsx from "clsx";
import ReactPlayer from "react-player";
import { toast } from "sonner";
const validateFile = (file, fileType) => {
  let isValid = true;
  let errorMessage = "";

  // Validate file type
  if (fileType === "image") {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      isValid = false;
      errorMessage = "File phải là ảnh (jpg, png, gif, etc.)";
      return { isValid, errorType: "image", errorMessage };
    }
  } else if (fileType === "audio") {
    const isAudio = file.type === "audio/mpeg";
    if (!isAudio) {
      isValid = false;
      errorMessage = "File phải là nhạc MP3";
      return { isValid, errorType: "audio", errorMessage };
    }
  } else if (fileType === "video") {
    const isVideo = file.type === "video/mp4";
    if (!isVideo) {
      isValid = false;
      errorMessage = "File phải là video MP4";
      return { isValid, errorType: "video", errorMessage };
    }
  }

  // Validate file size
  const isLessThan50MB = file.size / 1024 / 1024 < 50;
  if (!isLessThan50MB) {
    isValid = false;
    errorMessage = "File phải nhỏ hơn 50MB";
    return { isValid, errorType: "size", errorMessage };
  }

  return { isValid, errorType: null, errorMessage: "" };
};
const UploadFile = ({
  form,
  nameUrl,
  readonly,
  nameFile,
  label,
  content = "Tải file",
  fileType = "image", // Default file type is image
  type,
  ...props
}) => {
  const beforeUploadHandler = (file) => {
    return false; // Prevent default upload behavior
  };

  const onChangeHandler = (info) => {
    const file = info.file;
    const { isValid, errorType, errorMessage } = validateFile(
      info.file,
      fileType
    ); // Updated validation for files
    if (!isValid) {
      toast.error(errorMessage);
      if (form && errorType) {
        form.setFields([{ name: nameFile, errors: [errorMessage] }]);
      }
      return;
    }

    const localUrl = URL.createObjectURL(file);
    form.setFieldsValue({ [nameUrl]: localUrl });
    form.setFields([{ name: nameFile, errors: [] }]);
  };

  const handleDeleteFile = () => {
    form.setFieldValue(nameFile, null);
    form.setFieldValue(nameUrl, null);
  };

  const fileUrl = useWatch(nameUrl, { form, preserve: true });

  const renderPreview = () => {
    if (!fileUrl) return null;

    if (fileType === "image") {
      return <Image src={fileUrl} alt="file" />;
    }

    if (fileType === "audio") {
      return (
        <audio controls>
          <source src={fileUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      );
    }

    if (fileType === "video") {
      return (
        <video controls width="250">
          <source src={fileUrl} type="video/mp4" />
          Your browser does not support the video element.
        </video>
      );
    }

    return null;
  };
  console.log("fileUrl", fileUrl);

  return (
    <Form.Item
      className={clsx(readonly ? "pointer-events-none" : "")}
      name={nameFile}
      label={label}
      rules={props?.rules}
    >
      <Dragger
        beforeUpload={beforeUploadHandler}
        onChange={(info) => onChangeHandler(info)}
        //    className={styles.removeNameFile}
      >
        {fileUrl ? (
          <div
          //   className={styles.fileContainer}
          >
            {type !== "add" ? (
              <>
                <ReactPlayer
                  url={fileUrl}
                  controls
                  playing={false}
                  width="50%"
                  height="50%"
                />
              </>
            ) : (
              renderPreview()
            )}
            <div
            //   className={styles.overlay}
            >
              <Button
                className="bg-transparent text-white border-none"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile();
                }}
              >
                X
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="ant-upload-text text-center font-normal text-xs leading-6">
              {content}
            </p>
            <p className="ant-upload-hint text-center font-roboto text-[10px] font-normal leading-[22px] text-black/45">
              Tải lên{" "}
              {fileType === "image"
                ? "ảnh"
                : fileType === "audio"
                ? "nhạc MP3"
                : "video"}{" "}
              có dung lượng dưới 50MB
            </p>
          </>
        )}
      </Dragger>
    </Form.Item>
  );
};

export default UploadFile;
