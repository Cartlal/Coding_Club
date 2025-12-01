
import json
import re

# Read the file content
with open('src/utils/mockMemberData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the array content
match = re.search(r'export const mockMembers = (\[.*?\]);', content, re.DOTALL)
if not match:
    print("Could not find mockMembers array")
    exit(1)

json_str = match.group(1)

# Manual parsing because the JS object is not valid JSON and regex replacement is fragile
# We will use `eval` on a sanitized string which is risky but effective for this specific controlled context
# or better, we can just use a more robust regex replacement strategy.

# Let's try to make it valid Python syntax (dicts and lists)
py_str = json_str
py_str = re.sub(r'//.*', '', py_str) # Remove comments
py_str = re.sub(r'(\s)(\w+):', r'\1"\2":', py_str) # Quote keys
# The above regex might be too aggressive if keys are already quoted or inside strings.
# But looking at the file, keys are unquoted.

# Let's try a different approach: simple text processing line by line to build the objects
members = []
current_member = {}
in_member = False

lines = json_str.split('\n')
for line in lines:
    line = line.strip()
    if line == '{':
        current_member = {}
        in_member = True
        continue
    if line.startswith('},') or line == '}':
        if in_member:
            members.append(current_member)
            in_member = False
        continue
    
    if in_member:
        # Parse key-value pairs
        # e.g. name: 'Akhilesh Joshi',
        # e.g. skills: ['Leadership', 'React', 'Node.js', 'Management'],
        if ':' in line:
            key, val = line.split(':', 1)
            key = key.strip()
            val = val.strip().rstrip(',')
            
            # Clean value
            if val.startswith("'") and val.endswith("'"):
                val = val[1:-1]
            elif val.startswith('"') and val.endswith('"'):
                val = val[1:-1]
            elif val.isdigit():
                val = int(val)
            elif val.startswith('[') and val.endswith(']'):
                # Simple list parsing
                inner = val[1:-1]
                val = [x.strip().strip("'").strip('"') for x in inner.split(',') if x.strip()]
            
            current_member[key] = val

# Map by ID for easy access
member_map = {m['id']: m for m in members}

# Fix: Merge ID 60 (Shreya S Pai, Prog) into ID 43 (Shreya Pai, Comp Mgmt)
if 60 in member_map and 43 in member_map:
    shreya_prog = member_map[60]
    shreya_comp = member_map[43]
    
    # Transfer details
    shreya_comp['image'] = shreya_prog.get('image', shreya_comp.get('image'))
    shreya_comp['bio'] = shreya_prog.get('bio', shreya_comp.get('bio'))
    shreya_comp['linkedin'] = shreya_prog.get('linkedin', shreya_comp.get('linkedin'))
    shreya_comp['instagram'] = shreya_prog.get('instagram', shreya_comp.get('instagram'))
    shreya_comp['skills'] = shreya_prog.get('skills', shreya_comp.get('skills'))
    # Keep role as Competition Management
    
    # Remove ID 60
    del member_map[60]

# Define the ordered list of IDs based on user request
ordered_ids = [
    # Core (Keep existing order for top 6)
    1, 2, 3, 4, 5, 6,
    
    # Leads (Keep existing order for leads)
    7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
    
    # Development
    18, # Jaydeep Nadkarni
    19, # Shivkumar A sindolli
    20, # Samiksha
    21, # Kartik Hirenarti
    22, # Divya Gour
    23, # Abhishek Mannoli
    
    # AI
    24, # Harshit Jakati
    25, # Chandrakanth D U
    26, # Arpita Malalikar
    27, # Vaishnavi Modekar
    28, # Chinmayi T
    29, # Shreya Kalaj
    30, # Varshini Kulkarni
    31, # Varsha B
    
    # Emerging Tech
    32, # Manmohan Havanur
    33, # Rudra Kulkarni
    34, # Siddu Patil
    35, # Shivaleela
    36, # Namrata
    37, # Aditya
    
    # Competition Management
    38, # Daivik Naik
    39, # Srushti Payannawar
    40, # Sumedha Upadhye
    41, # Tanusha
    42, # Vaibhav
    43, # Shreya Pai (Merged)
    44, # Sanaha Mugutkhan
    
    # PR Team
    45, # Pavitra H
    46, # Sneha Hundekar
    47, # Saamiya Shaikh
    48, # Mallikarjungouda Patil
    49, # Pranjali Mutagekar
    50, # Spandana B
    
    # Programming Team
    51, # Lomesh Jangde
    52, # Arun Mokashi
    53, # Samarth Narvekar
    54, # Darshan Kittur
    55, # Namrata S
    56, # Rikhil Gopi
    57, # Suprita Hongal
    58, # Ankit Raj Sharma
    59, # Laxmi Patil
    69, # Siddhi
    
    # Media & Design
    61, # Omganesh
    62, # Shlok Daga
    63, # Fatima
    64, # Shantkumar
    65, # Prasanna Hosmani
    66, # Aditya Deshpande
    67, # Ayush Shetty
    68  # Soumya honnaik
]

# Name updates map
name_updates = {
    41: "Tanusha",
    44: "Sanaha Mugutkhan",
    51: "Lomesh Jangde",
    55: "Namrata S",
    23: "Abhishek Mannoli"
}

# Construct new list
new_members_list = []
for mid in ordered_ids:
    if mid in member_map:
        m = member_map[mid]
        if mid in name_updates:
            m['name'] = name_updates[mid]
        new_members_list.append(m)

# Generate JS output
js_output = "export const mockMembers = [\n"

# Helper to format object
def format_obj(obj):
    lines = ["  {"]
    for k, v in obj.items():
        val_str = ""
        if isinstance(v, str):
            val_str = f"'{v}'"
        elif isinstance(v, int):
            val_str = str(v)
        elif isinstance(v, list):
            val_str = "[" + ", ".join([f"'{x}'" for x in v]) + "]"
        else:
            val_str = str(v)
        lines.append(f"    {k}: {val_str},")
    lines.append("  },")
    return "\n".join(lines)

# Add comments for sections
sections = {
    1: "  // Core Committee",
    7: "\n  // Functional Team Leads & Co-Leads",
    18: "\n  // Development Team Members",
    24: "\n  // AI Team Members",
    32: "\n  // Emerging Tech Members",
    38: "\n  // Competition Management Members",
    45: "\n  // PR Team Members",
    51: "\n  // Programming Team Members",
    61: "\n  // Media & Design Members"
}

for m in new_members_list:
    if m['id'] in sections:
        js_output += sections[m['id']] + "\n"
    js_output += format_obj(m) + "\n"

js_output += "];\n"

# Read the original file again to get the functions at the bottom
with open('src/utils/mockMemberData.js', 'r', encoding='utf-8') as f:
    full_content = f.read()

# Split at the start of functions
parts = full_content.split('export function getAllRoles()')
functions_part = 'export function getAllRoles()' + parts[1] if len(parts) > 1 else ""

# Combine
final_content = """/**
 * Mock Members Data
 * ArcStack - KLE Tech Belagavi Campus
 * Academic Cycle 2025 - 2026
 */

""" + js_output + "\n\n" + functions_part

with open('src/utils/mockMemberData.js', 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Successfully updated mockMemberData.js")
