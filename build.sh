#!/bin/bash
echo "Compiling DPI Engine for Linux..."
g++ -std=c++17 -O2 -I include -o dpi_engine src/dpi_mt.cpp src/pcap_reader.cpp src/packet_parser.cpp src/sni_extractor.cpp src/types.cpp

if [ $? -eq 0 ]; then
    echo "Successfully compiled dpi_engine"
else
    echo "Compilation failed!"
    exit 1
fi

echo "Installing Python dependencies..."
pip install -r backend/requirements.txt
