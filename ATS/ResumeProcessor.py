from .parsers import ParseResume

class ResumeProcessor:
    def __init__(self, input_text):
        self.input_file_text = input_text

    def process(self) -> bool:
        try:
            resume_dict = self._read_resumes()
            return resume_dict
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return None

    def _read_resumes(self) -> dict:
        output = ParseResume(self.input_file_text).get_JSON()
        return output