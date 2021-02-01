import json

import boto3
import csv
import json
from boto3.dynamodb.conditions import Key, Attr

db_region = "us-west-1"
db_version_info = "VersionInfo"
db_application_info = "ApplicationInfo"
db_instances_info = "InstanceInfo"


''' Fetch full list of configured applications '''
def fetch_applications():
    application_list = []
    dynamodb = boto3.resource('dynamodb', region_name=db_region)
    table = dynamodb.Table(db_application_info)
    response = table.scan()
    for app in response['Items']:
        application_list.append({"id": app["id"], "name": app["name"], "category": app["category"], "versionUri": app["versionUri"], "dependencyVersionUri": app["dependencyVersionUri"],
                               "monitorUrl": app["monitorUrl"], "buildUrl": app["buildUrl"], "hostMap": app["hostMap"], "hostScheme": app["hostScheme"], "hostPort": app["hostPort"]})
    return application_list


''' Fetch details for a specific application '''
def fetch_application(appId):
    appInfo = []
    dynamodb = boto3.resource('dynamodb', region_name=db_region)
    table = dynamodb.Table(db_application_info)
    try:
        response = table.get_item(Key={'id': appId})
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        appInfo.append(response['Item'])
        return appInfo

''' Fetch details for a specific application '''
def fetch_application_instances(env, appId):
    instanceInfo = []
    dynamodb = boto3.resource('dynamodb', region_name=db_region)
    table = dynamodb.Table(db_instances_info)
    try:
        response = table.get_item(Key={'env': env, 'appId': appId})
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        for instance in response['Item']['instances']:
            instanceInfo.append({"instance": instance['instance'], "version": instance['version']})
        return instanceInfo
        
''' Fetch latest version info '''
def fetch_versions_for_env(env):
    version_list = []
    dynamodb = boto3.resource('dynamodb', region_name=db_region)
    table = dynamodb.Table(db_version_info)
    response = table.query(KeyConditionExpression=Key('env').eq(env))
    for app in response['Items']:
        version_list.append({"env": app["env"], "appId": app["appId"], "category": app["category"], "version": app["version"], "lastStatusPollTime": str(app["statusTime"]), "lastDeployTime": str(app["deployTime"])})
    return version_list


    
def lambda_handler(event, context):
    print("{} - {}".format(event, context))
    if event['path'] == '/applications':
        app_list = fetch_applications()
        return {
            'statusCode': 200,
            'body': json.dumps(app_list)
        }
    elif event['resource'] == '/applications/{id}':
        appId = event['pathParameters']['id'].lower()
        appInfo = fetch_application(appId)
        return {
            'statusCode': 200,
            'body': json.dumps(appInfo)
        }
    elif event['path'] == '/versions':
        env = event['queryStringParameters']['env'].lower()
        version_list = fetch_versions_for_env(env)
        return {
            'statusCode': 200,
            'body': json.dumps(version_list)
        }
    elif event['resource'] == '/instances/{id}':
        appId = event['pathParameters']['id'].lower()
        env = event['queryStringParameters']['env'].lower()
        instance_list = fetch_application_instances(env, appId)
        return {
            'statusCode': 200,
            'body': json.dumps(instance_list)
        }
    else:
        return {
            'statusCode': 200,
            'body': "No data"
        }