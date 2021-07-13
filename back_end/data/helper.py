def get_dict_from_tuples_list(tuples_list):
    result = {}
    for tuple_item in tuples_list:
        result[tuple_item[0]] = tuple_item[1]
    return result


#put all helper functions here