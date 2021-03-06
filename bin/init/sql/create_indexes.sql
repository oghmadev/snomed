CREATE INDEX description_conceptid_idx
  ON "Description" USING BTREE ("conceptId");

CREATE INDEX textdefinition_conceptid_idx
  ON "TextDefinition" USING BTREE ("conceptId");

CREATE INDEX relationship_sourceid_destinationid_idx
  ON "Relationship" USING BTREE ("sourceId", "destinationId");

CREATE INDEX stated_relationship_sourceid_destinationid_idx
  ON "StatedRelationship" USING BTREE ("sourceId", "destinationId");

CREATE INDEX relationship_sourceid_idx
  ON "Relationship" USING BTREE ("sourceId");

CREATE INDEX stated_relationship_sourceid_idx
  ON "StatedRelationship" USING BTREE ("sourceId");

CREATE INDEX relationship_destinationid_idx
  ON "Relationship" USING BTREE ("destinationId");

CREATE INDEX stated_relationship_destinationid_idx
  ON "StatedRelationship" USING BTREE ("destinationId");

CREATE INDEX langrefset_referencedcomponentid_idx
  ON "LanguageRefset" USING BTREE ("referencedComponentId");

CREATE INDEX associationrefset_f_idx
  ON "Association" USING BTREE ("referencedComponentId", "targetComponentId");

CREATE INDEX transitiveclosure_subtypeid_idx
  ON "TransitiveClosure" USING BTREE ("subtypeId");

CREATE INDEX transitiveclosure_supertypeid_idx
  ON "TransitiveClosure" USING BTREE ("supertypeId");

CREATE INDEX description_term_trgm_idx
  ON "Description" USING gin (term gin_trgm_ops);
