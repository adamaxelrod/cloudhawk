
import urllib3
import json
import time
import sys
import getopt
from datetime import datetime

import boto3
import csv
import json
from boto3.dynamodb.conditions import Key, Attr

PREPROD_API_HOST="172.29.25.163"
PROD_API_HOST="172.29.25.249"
API_PATH="server"

API_HOST=""

db_version_info = "VersionInfo"
db_region = "us-west-1"

types = [ 'web', 'device', 'media', 'partner', 'partnercontainerised', 'ultramedia', 'pgw', 'secdevice', 'livestream', 'arlodealer', 'customersupport', 'ssocallback', 'callbacks', 'arlostream', 'cvrstream', 'arloanalytics', 'notification', 'clientgateway', 'devicegateway']

app_lookup = {'media:hmsweb' : 'hmsweb-media', 'web:hmsweb': 'hmsweb-web', 'device:hmsweb': 'hmsweb-device'}

category_lookup = {'partnercontainerised': 'partner'}

''' Set environment-specific vars '''
def setEnv(env):
    global API_HOST
    if env == 'production':
        API_HOST = PROD_API_HOST
    else:
        API_HOST = PREPROD_API_HOST
    
''' Fetch profile and partnerId assignment for user '''
def fetch_version_info(env, type):
    global API_HOST
    global API_PATH
    
    r = urllib3.PoolManager().request('GET',
                    "http://{0}/{1}/{2}/version?type={3}&environment={4}".format(API_HOST, API_PATH, env, type, env))

    if (r.status == 200):
        data = json.loads(r.data.decode('utf-8'))
        print('----------------------------------')
        if len(data) > 0:
            for dataItem in data:
                version = dataItem['version']
                print('V: {}'.format(json.dumps(version)))
                for app in version:
                    if 'name' in version[app]:
                        versionJson = json.loads(version[app])
                        print("VERSION: {} {} {}".format(data[0]['type'], versionJson['name'], versionJson['version']))       
                        load_version_info(env, data[0]['type'], versionJson['name'], versionJson['version'])
    else:
        print("FETCH VERSION FAILURE: {} {}".format(r.status, r.data))


def lookup(type, category, application):
    if type == 'category' and category in category_lookup:
        return category_lookup[category]
    if type == 'app':
        field = category + ':' + application
        if field in app_lookup:
            return app_lookup[category + ':' + application]
    return category if type == 'category' else application


def load_version_info(env, category, application, version):
    try:
        dynamodb = boto3.resource('dynamodb', region_name=db_region)
        table = dynamodb.Table(db_version_info)

        table.put_item(Item={
                'env': env,
                'appId': lookup('app', category, application),
                'category': lookup('category', category, application),
                'version': version,
                'deployTime': round(time.time() * 1000),
                'statusTime': round(time.time() * 1000)
            })
    except KeyError:
        print("Exception storing data")

     
def performFlow(argv):
    env = ""
    try:
        opts, args = getopt.getopt(argv,"e:v",["env="])
    except getopt.GetoptError:
        print("Usage: cloudhawk_load.py --env=<goldendev|goldendqa|production>")
        sys.exit(2)
    for opt, arg in opts:
        if opt in ("-e", "--env"):
            env = arg

    setEnv(env)            
    for app in types:
        fetch_version_info(env, app)
        
    
if __name__ == "__main__":
    performFlow(sys.argv[1:])
