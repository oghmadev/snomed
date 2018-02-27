#!/usr/bin/env python3

from datetime import datetime
from db_utils import copy_from_csv, get_connection
from script_utils import create_arg_parser, get_config, get_data_file_path

def init_snomed():
    db_config = get_config('postgres')

    with get_connection(**db_config) as connection:
        with connection.cursor() as cursor:
            with open(get_data_file_path('snomed/sct2_Concept_Snapshot_INT_20180131.txt'), 'r') as data_file:
                fields = ('id', 'effectiveTime', 'active', 'moduleId', 'definitionStatusId')
                copy_from_csv(cursor, data_file, 'Concept', fields)

            with open(get_data_file_path('snomed/sct2_Concept_SpanishExtensionSnapshot_INT_20171031.txt'), 'r') as data_file:
                fields = ('id', 'effectiveTime', 'active', 'moduleId', 'definitionStatusId')
                copy_from_csv(cursor, data_file, 'Concept', fields)

            with open(get_data_file_path('snomed/sct2_Description_SpanishExtensionSnapshot-es_INT_20171031.txt'), 'r') as data_file:
                fields = ('id', 'effectiveTime', 'active', 'moduleId', 'conceptId', 'languageCode', 'typeId', 'term', 'caseSignificanceId')
                copy_from_csv(cursor, data_file, 'Description', fields)

            with open(get_data_file_path('snomed/sct2_Relationship_Snapshot_INT_20180131.txt'), 'r') as data_file:
                fields = ('id', 'effectiveTime', 'active', 'moduleId', 'sourceId', 'destinationId', 'relationshipGroup', 'typeId', 'characteristicTypeId', 'modifierId')
                copy_from_csv(cursor, data_file, 'Relationship', fields)

            with open(get_data_file_path('snomed/sct2_Relationship_SpanishExtensionSnapshot_INT_20171031.txt'), 'r') as data_file:
                fields = ('id', 'effectiveTime', 'active', 'moduleId', 'sourceId', 'destinationId', 'relationshipGroup', 'typeId', 'characteristicTypeId', 'modifierId')
                copy_from_csv(cursor, data_file, 'Relationship', fields)

            with open(get_data_file_path('snomed/sct2_StatedRelationship_Snapshot_INT_20180131.txt'), 'r') as data_file:
                fields = ('id', 'effectiveTime', 'active', 'moduleId', 'sourceId', 'destinationId', 'relationshipGroup', 'typeId', 'characteristicTypeId', 'modifierId')
                copy_from_csv(cursor, data_file, 'StatedRelationship', fields)

            with open(get_data_file_path('snomed/sct2_StatedRelationship_SpanishExtensionSnapshot_INT_20171031.txt'), 'r') as data_file:
                fields = ('id', 'effectiveTime', 'active', 'moduleId', 'sourceId', 'destinationId', 'relationshipGroup', 'typeId', 'characteristicTypeId', 'modifierId')
                copy_from_csv(cursor, data_file, 'StatedRelationship', fields)

            with open(get_data_file_path('snomed/sct2_TextDefinition_SpanishExtensionSnapshot-es_INT_20171031.txt'), 'r') as data_file:
                fields = ('id', 'effectiveTime', 'active', 'moduleId', 'conceptId', 'languageCode', 'typeId', 'term', 'caseSignificanceId')
                copy_from_csv(cursor, data_file, 'TextDefinition', fields)

            with open(get_data_file_path('snomed/der2_cRefset_LanguageSnapshot-en_INT_20180131.txt'), 'r') as data_file:
                fields = ('id', 'effectiveTime', 'active', 'moduleId', 'refsetId', 'referencedComponentId', 'acceptabilityId')
                copy_from_csv(cursor, data_file, 'LanguageRefset', fields)

            with open(get_data_file_path('snomed/der2_cRefset_LanguageSpanishExtensionSnapshot-es_INT_20171031.txt'), 'r') as data_file:
                fields = ('id', 'effectiveTime', 'active', 'moduleId', 'refsetId', 'referencedComponentId', 'acceptabilityId')
                copy_from_csv(cursor, data_file, 'LanguageRefset', fields)

            with open(get_data_file_path('snomed/der2_cRefset_AssociationSnapshot_INT_20180131.txt'), 'r') as data_file:
                fields = ('id', 'effectiveTime', 'active', 'moduleId', 'refsetId', 'referencedComponentId', 'targetComponentId')
                copy_from_csv(cursor, data_file, 'Association', fields)

            with open(get_data_file_path('snomed/der2_cRefset_AssociationReferenceSpanishExtensionSnapshot_INT_20171031.txt'), 'r') as data_file:
                fields = ('id', 'effectiveTime', 'active', 'moduleId', 'refsetId', 'referencedComponentId', 'targetComponentId')
                copy_from_csv(cursor, data_file, 'Association', fields)

            connection.commit()


def main():
    create_arg_parser(prog_name=__file__, desc='Init SNOMED related tables')

    init_snomed()


if __name__ == '__main__':
    main()
