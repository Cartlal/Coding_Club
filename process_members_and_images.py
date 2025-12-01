
import json
import os
import shutil
import re

# Paths
MEMBERS_JSON = 'members.json'
IMAGES_DIR = r'Mebmers_images\Professional Photo  (for Website Members Page)  (File responses)'
TARGET_IMAGES_DIR = r'public\images\members'
MOCK_DATA_FILE = r'src\utils\mockMemberData.js'

# Load members
try:
    with open(MEMBERS_JSON, 'r', encoding='utf-8') as f:
        members = json.load(f)
except UnicodeDecodeError:
    with open(MEMBERS_JSON, 'r', encoding='utf-16') as f:
        members = json.load(f)

# Ensure target images dir exists
os.makedirs(TARGET_IMAGES_DIR, exist_ok=True)

# List available images
available_images = os.listdir(IMAGES_DIR)

# Helper to normalize string for matching
def normalize(s):
    return re.sub(r'[^a-z0-9]', '', s.lower())

# Process members
for member in members:
    name = member.get('name', '')
    if not name:
        continue
    
    norm_name = normalize(name)
    
    # Find matching image
    found_image = None
    for img_name in available_images:
        # Check if member name is in filename (ignoring case/special chars roughly)
        # The files are like "prefix - Name Surname.ext"
        # We can check if "Name Surname" is in the filename
        if name.lower() in img_name.lower():
            found_image = img_name
            break
        
        # Fallback: check normalized
        if norm_name in normalize(img_name):
            found_image = img_name
            break
            
    if found_image:
        # Copy image
        src_path = os.path.join(IMAGES_DIR, found_image)
        ext = os.path.splitext(found_image)[1].lower()
        new_filename = f"{name.replace(' ', '-')}{ext}"
        dst_path = os.path.join(TARGET_IMAGES_DIR, new_filename)
        
        shutil.copy2(src_path, dst_path)
        print(f"Updated image for {name}: {new_filename}")
        
        # Update member record
        member['image'] = f"/images/members/{new_filename}"
    else:
        print(f"No image found for {name}")
        # Keep existing image or set default if not present?
        # If the sheet had a drive link, it might still be there.
        # If we want to use local images only, we might want to leave it as is if it's already local,
        # or set to default if it's a drive link and we couldn't find a local one.
        # But for now, let's just leave it if we didn't find a match in the folder.
        pass

# Generate JS output
js_output = "export const mockMembers = [\n"

def format_obj(obj):
    lines = ["  {"]
    for k, v in obj.items():
        val_str = ""
        if isinstance(v, str):
            # Escape single quotes
            safe_v = v.replace("'", "\\'")
            val_str = f"'{safe_v}'"
        elif isinstance(v, int):
            val_str = str(v)
        elif isinstance(v, list):
            # List of strings
            safe_list = []
            for x in v:
                safe_x = x.replace("'", "\\'")
                safe_list.append(f"'{safe_x}'")
            val_str = "[" + ", ".join(safe_list) + "]"
        else:
            val_str = str(v)
        lines.append(f"    {k}: {val_str},")
    lines.append("  },")
    return "\n".join(lines)

# We can try to preserve sections if we know the IDs or roles
# But `new_members.js` might not be sorted.
# Let's just dump them for now.
for m in members:
    js_output += format_obj(m) + "\n"

js_output += "];\n"

# Read original file to keep header/footer
try:
    with open(MOCK_DATA_FILE, 'r', encoding='utf-8') as f:
        original_content = f.read()
except UnicodeDecodeError:
    with open(MOCK_DATA_FILE, 'r', encoding='latin-1') as f:
        original_content = f.read()

# Extract header (up to export const mockMembers)
header_match = re.search(r'(/\*\*.*?\*/\s*)export const mockMembers', original_content, re.DOTALL)
header = header_match.group(1) if header_match else "/**\n * Mock Members Data\n */\n\n"

# Extract footer (functions)
# Look for the first export function after the array
footer_match = re.search(r'(export function.*)', original_content, re.DOTALL)
footer = footer_match.group(1) if footer_match else ""

# If footer extraction failed because it was part of the file content not separated clearly
# We can just look for "export function getAllRoles"
if "export function getAllRoles" in original_content:
    parts = original_content.split("export function getAllRoles")
    footer = "export function getAllRoles" + parts[1]

final_content = header + js_output + "\n" + footer

with open(MOCK_DATA_FILE, 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Successfully updated mockMemberData.js with new members and images.")
