#!/usr/bin/env python3
import subprocess

def start_sshd():
    subprocess.run(["/usr/sbin/sshd", "-D"])

if __name__ == "__main__":
    start_sshd()
