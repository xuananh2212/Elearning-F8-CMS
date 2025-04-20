const {
  default: AddEditLessonDocument,
} = require("../lesson-documents/AddEditLessonDocument");
const {
  default: AddEditLessonQuizzs,
} = require("../lesson-quizzs/AddEditLessonQuizzs");
const { default: AddEditVideos } = require("../lesson-videos/AddEditVideos");

const RenderLessons = ({ currentAction }) => {
  switch (currentAction?.key) {
    case "1":
      return <AddEditVideos currentAction={currentAction} />;
    case "2":
      return <AddEditLessonDocument currentAction={currentAction} />;
    case "3":
      return <AddEditLessonQuizzs currentAction={currentAction} />;
    default:
      return <></>;
  }
};
export default RenderLessons;
