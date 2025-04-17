from slither.slither import Slither
from slither.exceptions import SlitherError
import sys
import os

def analyze_solidity_file(solidity_file_path):
    if not os.path.isfile(solidity_file_path):
        print(f"Error: File '{solidity_file_path}' does not exist.")
        return

    try:
        # Run Slither on the Solidity file
        slither = Slither(solidity_file_path)
        slither.run_detectors()  # Run the detectors

        print(f"\n✅ Analyzing {solidity_file_path}...\n")

        all_findings = []

        for detector in slither._detectors:  # Access the detector list
            results = detector.detect()
            if results:
                for finding in results:
                    all_findings.append({
                        'check': detector.NAME,
                        'impact': detector.IMPACT,
                        'description': finding['description'],
                        'location': finding['elements'][0].source_mapping.lines if finding['elements'] else "N/A"
                    })

        if not all_findings:
            print("🎉 No vulnerabilities detected by Slither.")
        else:
            for idx, issue in enumerate(all_findings, 1):
                print(f"🔍 Issue {idx}:")
                print(f"Type       : {issue['check']}")
                print(f"Impact     : {issue['impact']}")
                print(f"Description: {issue['description']}")
                print(f"Location   : {issue['location']}")
                print("-" * 60)

    except SlitherError as e:
        print(f"❌ Slither analysis failed: {str(e)}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python analyze_solidity.py <path_to_solidity_file>")
    else:
        analyze_solidity_file(sys.argv[1])
