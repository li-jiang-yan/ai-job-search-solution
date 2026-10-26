import ResumeSummary from './ResumeSummary';

const ResumeEditor = ({ editorOpen, object, flatResume }) => {
  if (!editorOpen) {
    return null;
  }

  return (
    <>
      <h6>Resume Summary</h6>
      <ResumeSummary object={object} flatResume={flatResume} />
    </>
  );
};

export default ResumeEditor;
