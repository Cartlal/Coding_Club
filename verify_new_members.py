
import re
import json

try:
    with open('new_members.js', 'r', encoding='utf-16') as f:
        content = f.read()
except UnicodeError:
    with open('new_members.js', 'r', encoding='utf-8') as f:
        content = f.read()

print(f"File length: {len(content)}")

# Extract array
match = re.search(r'export const mockMembers = (\[.*?\]);', content, re.DOTALL)
if match:
    json_str = match.group(1)
    print("Found mockMembers array.")
    
    # Basic cleanup to make it printable/checkable
    # We won't fully parse it yet, just check structure
    print(f"Array string length: {len(json_str)}")
    print("First 500 chars of array:")
    print(json_str[:500])
else:
    print("Could not find mockMembers array pattern.")
    print("First 500 chars of file:")
    print(content[:500])

print("Last 500 chars of file:")
print(content[-500:])
