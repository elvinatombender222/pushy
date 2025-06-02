#!/usr/bin/env python3
"""
Tasker HTTP Trigger System
Requirements:
    pip install requests
"""
import requests
import argparse
import json
from typing import Optional, Dict
import sys

class TaskerTrigger:
    def __init__(self, phone_ip: str, port: int = 8080):
        """
        Initialize the Tasker trigger system.
        
        Args:
            phone_ip: IP address of your Android phone
            port: Port number Tasker is listening on (default 8080)
        """
        self.base_url = f"http://{phone_ip}:{port}"
        
    def trigger_task(self, 
                     task_name: str, 
                     params: Optional[Dict] = None) -> bool:
        """
        Trigger a Tasker task with optional parameters.
        
        Args:
            task_name: Name of the Tasker task to trigger
            params: Optional dictionary of parameters to pass to the task
            
        Returns:
            bool: True if successful, False otherwise
        """
        url = f"{self.base_url}/task/{task_name}"
        
        try:
            if params:
                response = requests.post(url, json=params, timeout=5)
            else:
                response = requests.get(url, timeout=5)
                
            if response.status_code == 200:
                print(f"Successfully triggered task: {task_name}")
                return True
            else:
                print(f"Error: Server returned status code {response.status_code}", 
                      file=sys.stderr)
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"Error triggering task: {str(e)}", file=sys.stderr)
            return False

def main():
    parser = argparse.ArgumentParser(description='Trigger Tasker tasks remotely')
    parser.add_argument('--ip', required=True, help='IP address of your Android phone')
    parser.add_argument('--port', type=int, default=8080, help='Tasker HTTP port (default: 8080)')
    parser.add_argument('--task', required=True, help='Name of the Tasker task to trigger')
    parser.add_argument('--params', type=json.loads, help='JSON string of parameters to pass')
    
    args = parser.parse_args()
    
    trigger = TaskerTrigger(args.ip, args.port)
    success = trigger.trigger_task(args.task, args.params)
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
