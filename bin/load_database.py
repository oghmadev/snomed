#!/usr/bin/env python3
from datetime import datetime
from glob import iglob
from db_utils import copy_from_csv, get_connection
from script_utils import create_arg_parser, get_config, get_data_file_path

def init_snomed():
    db_config = get_config('postgres')

    with get_connection(**db_config) as connection:
        with connection.cursor() as cursor:
            for f in iglob(get_data_file_path('sct2_Concept*.txt')):
                with open(f, 'r') as data_file:
                    fields = ('id', 'effectiveTime', 'active', 'moduleId', 'definitionStatusId')
                    copy_from_csv(cursor, data_file, 'Concept', fields)

            for f in iglob(get_data_file_path('sct2_Description*.txt')):
                with open(f, 'r') as data_file:
                    fields = ('id', 'effectiveTime', 'active', 'moduleId', 'conceptId', 'languageCode', 'typeId', 'term', 'caseSignificanceId')
                    copy_from_csv(cursor, data_file, 'Description', fields)

            for f in iglob(get_data_file_path('sct2_Relationship*.txt')):
                with open(f, 'r') as data_file:
                   fields = ('id', 'effectiveTime', 'active', 'moduleId', 'sourceId', 'destinationId', 'relationshipGroup', 'typeId', 'characteristicTypeId', 'modifierId')
                   copy_from_csv(cursor, data_file, 'Relationship', fields)

            for f in iglob(get_data_file_path('sct2_StatedRelationship*.txt')):
                with open(f, 'r') as data_file:
                    fields = ('id', 'effectiveTime', 'active', 'moduleId', 'sourceId', 'destinationId', 'relationshipGroup', 'typeId', 'characteristicTypeId', 'modifierId')
                    copy_from_csv(cursor, data_file, 'StatedRelationship', fields)

            for f in iglob(get_data_file_path('sct2_TextDefinition*.txt')):
                with open(f, 'r') as data_file:
                    fields = ('id', 'effectiveTime', 'active', 'moduleId', 'conceptId', 'languageCode', 'typeId', 'term', 'caseSignificanceId')
                    copy_from_csv(cursor, data_file, 'TextDefinition', fields)

            for f in iglob(get_data_file_path('der2_cRefset_Language*.txt')):
                with open(f, 'r') as data_file:
                    fields = ('id', 'effectiveTime', 'active', 'moduleId', 'refsetId', 'referencedComponentId', 'acceptabilityId')
                    copy_from_csv(cursor, data_file, 'LanguageRefset', fields)

            for f in iglob(get_data_file_path('der2_cRefset_Association*.txt')):
                with open(f, 'r') as data_file:
                    fields = ('id', 'effectiveTime', 'active', 'moduleId', 'refsetId', 'referencedComponentId', 'targetComponentId')
                    copy_from_csv(cursor, data_file, 'Association', fields)

            for f in iglob(get_data_file_path('sct2_TransitiveClosure*.txt')):
                with open(f, 'r') as data_file:
                    fields = ('subtypeId', 'supertypeId')
                    copy_from_csv(cursor, data_file, 'TransitiveClosure', fields)

            connection.commit()


def main():
    create_arg_parser(prog_name=__file__, desc='Init SNOMED related tables')

    init_snomed()


if __name__ == '__main__':
    main()
