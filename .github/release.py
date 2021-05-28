import json
import sys

def increment_version():
    with open("package.json") as file:
        package_json = json.load(file)
    version = package_json["version"]
    parts = version.split(".")
    parts[2] = str(int(parts[2]) + 1)
    version = ".".join(parts)
    package_json["version"] = version
    with open("package.json", "w") as file:
        json.dump(package_json, file, indent=4)

def print_version():
    with open("package.json") as file:
        package_json = json.load(file)
    print(package_json["version"])

def main():
    if len(sys.argv) < 2:
        print("Not enough args")
        exit(1)
    if sys.argv[1] == "inc":
        increment_version()
    elif sys.argv[1] == "print":
        print_version()
    else:
        print("Unknown Argument", sys.argv[1])
        exit(2)

if __name__ == "__main__":
    main()