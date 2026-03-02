import os

message = "Where we're going, we don't need roads!"
binary_str = "".join(format(ord(c), '08b') for c in message) + "00000000"

paths = [
    os.path.expanduser("./public/lackeys.txt"),
    os.path.expanduser("./public/richard.txt")
]

def encode_files(file_paths, bin_data):
    data_iter = iter(bin_data)

    for file_path in file_paths:
        if not os.path.exists(file_path):
            continue

        with open(file_path, 'r', encoding='utf-8') as f:
            content = list(f.read())

        for i, char in enumerate(content):
            if char.isdigit():
                try:
                    content[i] = next(data_iter)
                except StopIteration:
                    break 

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write("".join(content))

def decode_files(file_paths):
    extracted_bits = ""

    for file_path in file_paths:
        if not os.path.exists(file_path):
            continue
        with open(file_path, 'r', encoding='utf-8') as f:
            for char in f.read():
                if char in "01":
                    extracted_bits += char

    decoded_message = ""
    for i in range(0, len(extracted_bits), 8):
        byte = extracted_bits[i:i+8]
        
        if len(byte) < 8 or byte == "00000000":
            break
            
        decoded_message += chr(int(byte, 2))

    return decoded_message

encode_files(paths, binary_str)
print("Encoded successfully.")

result = decode_files(paths)
print(f"Decoded Message: {result}")
