import AddEditVideos from "../lesson-videos/AddEditVideos";

const AddEditLessonDocument = ({ currentAction, setCurrentAction }) => {
  return (
    <AddEditVideos
      currentAction={currentAction}
      isHiddenVideos
      setCurrentAction={setCurrentAction}
    />
  );
};

export default AddEditLessonDocument;
