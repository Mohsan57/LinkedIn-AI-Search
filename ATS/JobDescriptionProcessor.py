import json
import os.path
import pathlib

from .parsers import ParseJobDesc

SAVE_DIRECTORY = f"{os.path.dirname(os.path.abspath(__file__))}/JobDescriptions/temp/"
if not os.path.exists(SAVE_DIRECTORY):
    os.makedirs(SAVE_DIRECTORY)

class JobDescriptionProcessor:
    def __init__(self, input_file_text, output_file_name):
        self.input_file_text = input_file_text
        self.output_file_name = output_file_name

    def process(self) -> bool:
        try:
            resume_dict = self._read_job_desc()
            # self._write_json_file(resume_dict)
            return resume_dict
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return None

    def _read_job_desc(self) -> dict:
        output = ParseJobDesc(self.input_file_text).get_JSON()
        return output

    # def _write_json_file(self, resume_dictionary: dict):
    #     file_name = self.output_file_name + ".json"
    #     save_directory_name = pathlib.Path(SAVE_DIRECTORY) / file_name
    #     json_object = json.dumps(resume_dictionary, sort_keys=True, indent=14)
    #     with open(save_directory_name, "w+") as outfile:
    #         outfile.write(json_object)
