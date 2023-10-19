import json
import re

sections = []

def process_data(data):
    global sections
    if(isinstance(data, str)):
        matches = re.findall(r'---(.*?)---</p>\n<p>(.*?)</p>', data)
        for match in matches:
            if match not in sections:
                sections.append({match[0]:match[1]})
    if data is not None and "edges" in data:
        edge = data["edges"]
        del data
        return [process_data(item) for item in edge]
    elif isinstance(data, list):
        return [process_data(item) for item in data]
    elif isinstance(data, dict):
        if "node" in data:
            nodes = data["node"]
            del data
            for key, value in nodes.items():
                nodes[key] = process_data(value)
            return nodes
        else:
            for key, value in data.items():
                data[key] = process_data(value)
        return data
    else:
        return data




def process_input(input_data, input_title):
    global sections 
    sections = []
    parsed_data = process_data(input_data)
    parsed_data["sections"] = sections
    
    output_filename = f'{input_title}_parsed.txt'
    with open(output_filename, 'w') as file:
        json.dump(parsed_data, file, indent=3)

    print(f'Output salvato in {output_filename}')


input_filenames = ["blog.json", "page.json", "products.json", "shop.json"]


for filename in input_filenames:
    with open(filename, 'r') as file:
        input_data = json.load(file)
    process_input(input_data["data"], filename.split('.')[0])
    
