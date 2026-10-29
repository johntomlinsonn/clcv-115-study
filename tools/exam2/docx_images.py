# Save the images of a .docx in document order (g01, g02, ...).
# Usage: python3 -I tools/exam2/docx_images.py <file.docx> <out-dir>
import sys, docx, os
from docx.oxml.ns import qn
d = docx.Document(sys.argv[1]); out = sys.argv[2]
rels = d.part.rels; i = 0
for blip in d.element.body.iter(qn('a:blip')):
    rid = blip.get(qn('r:embed')); part = rels[rid].target_part
    i += 1; ext = os.path.splitext(part.partname)[1]
    open(f"{out}/g{i:02d}{ext}", "wb").write(part.blob)
    print(i, part.partname, len(part.blob))
