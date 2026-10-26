import ResumeSummary from './ResumeSummary';

const ResumeEditor = ({ object, flatResume }) => {
  return (
    <>
      <h6>Resume Summary</h6>
      <ResumeSummary object={object} flatResume={flatResume} />
    </>
  );
};

export default ResumeEditor;
