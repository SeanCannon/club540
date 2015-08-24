'use strict';

var ALL_ALIASED_TRICK_FIELDS = 't_id             AS id,'              +
                               't_name           AS name, '           +
                               't_desc           AS description, '    +
                               't_aliases        AS aliases, '        +
                               't_tc_id          AS class_id, '       +
                               't_difficulty     AS difficulty, '     +
                               't_base_points    AS base_points, '    +
                               't_points_comment AS points_comment, ' +
                               't_types          AS types, '          +
                               't_prereqs        AS prerequisites, '  +
                               't_credit         AS credit, '         +
                               't_abbv           AS abbreviation, '   +
                               't_history        AS history, '        +
                               't_origins        AS origins, '        +
                               't_ex_in_array    AS ex_in_array, '    +
                               't_ex_out_array   AS ex_out_array, '   +
                               't_uri            AS uri ';

module.exports = {
  ALL_ALIASED_TRICK_FIELDS : ALL_ALIASED_TRICK_FIELDS
};
