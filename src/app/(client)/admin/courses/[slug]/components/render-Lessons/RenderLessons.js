const {
  default: AddEditLessonDocument,
} = require("../lesson-documents/AddEditLessonDocument");
const {
  default: AddEditLessonQuizzs,
} = require("../lesson-quizzs/AddEditLessonQuizzs");
const { default: AddEditVideos } = require("../lesson-videos/AddEditVideos");

const RenderLessons = ({ currentAction, setCurrentAction }) => {
  switch (currentAction?.key) {
    case "1":
      return (
        <AddEditVideos
          currentAction={currentAction}
          setCurrentAction={setCurrentAction}
        />
      );
    case "2":
      return (
        <AddEditLessonDocument
          currentAction={currentAction}
          setCurrentAction={setCurrentAction}
        />
      );
    case "3":
      return (
        <AddEditLessonQuizzs
          currentAction={currentAction}
          setCurrentAction={setCurrentAction}
        />
      );
    default:
      return <></>;
  }
};
export default RenderLessons;
