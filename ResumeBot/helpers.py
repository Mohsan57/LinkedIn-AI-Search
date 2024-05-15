import fitz

def extractInfoFromPDF(file_path, stream=False):
    try:
        doc = fitz.open(stream=file_path.read())
    except:
        doc = fitz.open(file_path)
    page_content = ""
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        page_content += page.get_text()
    text = [line.replace('\t', ' ') for line in page_content.split('\n') if line]
    return ' '.join(text)