import pytest
import unittest
from releaseDiff import equivalentSemicolonDelimitedValues


class TestStringMethods(unittest.TestCase):

    def test_reordered_pathogenicity_all_data(self):
        prev = "Uncertain_significance,Likely_benign (ClinVar); Pending (BIC)"
        new = "Likely_benign,Uncertain_significance (ClinVar); Pending (BIC)"
        self.assertTrue(equivalentSemicolonDelimitedValues(prev, new))

    def test_swapped_pathogenicity_all_data(self):
        prev = "Uncertain_significance,Likely_benign (ClinVar); Pending (BIC)"
        new = "Uncertain_significance,Likely_benign (BIC); Pending (ClinVar)"
        self.assertFalse(equivalentSemicolonDelimitedValues(prev, new))

    def test_different_pathogenicity_all_data(self):
        prev = "Uncertain_significance,Likely_benign (ClinVar); Pending (BIC)"
        new = "Likely_benign (ClinVar); Pending (BIC)"
        self.assertFalse(equivalentSemicolonDelimitedValues(prev, new))

    def test_same_pathogenicity_all_data_single_source(self):
        prev = "Uncertain_significance,Likely_benign (ClinVar)"
        new = "Likely_benign,Uncertain_significance (ClinVar)"
        self.assertTrue(equivalentSemicolonDelimitedValues(prev, new))


if __name__ == '__main__':
    pass
