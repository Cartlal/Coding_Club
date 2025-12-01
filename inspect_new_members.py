
import re
import json
import os

def read_file_content(filepath):
    try:
        with open(filepath, 'r', encoding='utf-16') as f:
            return f.read()
    except UnicodeError:
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            return None

content = read_file_content('new_members.js')
if not content:
    print("Failed to read new_members.js")
    exit(1)

# Try to find the array
match = re.search(r'export const mockMembers = (\[.*?\]);', content, re.DOTALL)
if match:
    print("Found mockMembers array in new_members.js")
    # Print first member to see structure
    array_str = match.group(1)
    # Naive parse of first object
    first_obj_match = re.search(r'\{.*?\}', array_str, re.DOTALL)
    if first_obj_match:
        print("First member object:")
        print(first_obj_match.group(0))
else:
    print("Could not find mockMembers array in new_members.js")
    print("First 200 chars:")
    print(content[:200])
