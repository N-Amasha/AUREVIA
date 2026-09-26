package com.aurevia.staff.repository;

import com.aurevia.staff.entity.LeaveRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.jpa.show-sql=true"
})
class LeaveRequestRepositoryTest {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Test
    void shouldLoadAllLeaveRequests() {
        assertThat(leaveRequestRepository.count()).isEqualTo(5);
    }

    @Test
    void shouldFindLeaveRequestsByEmployee() {
        List<LeaveRequest> requests =
                leaveRequestRepository
                        .findByEmployeeEmployeeIdOrderByRequestDateDesc(11);

        assertThat(requests)
                .extracting(LeaveRequest::getLeaveRequestId)
                .containsExactly(1);
    }

    @Test
    void shouldFindPendingRequestsWithNullReviewDetails() {
        List<LeaveRequest> requests =
                leaveRequestRepository
                        .findByRequestStatusIgnoreCaseOrderByRequestDateAsc(
                                "pending"
                        );

        assertThat(requests)
                .extracting(LeaveRequest::getLeaveRequestId)
                .containsExactly(3, 5);

        assertThat(requests)
                .allSatisfy(request -> {
                    assertThat(request.getReviewedByHrManager()).isNull();
                    assertThat(request.getReviewedDate()).isNull();
                });
    }

    @Test
    void shouldFindRequestsReviewedByHrManager() {
        List<LeaveRequest> requests =
                leaveRequestRepository
                        .findByReviewedByHrManagerEmployeeIdOrderByReviewedDateDesc(
                                26
                        );

        assertThat(requests)
                .extracting(LeaveRequest::getLeaveRequestId)
                .containsExactly(1);

        assertThat(requests.getFirst().getRequestStatus())
                .isEqualTo("APPROVED");
    }

    @Test
    void shouldFindAnnualLeaveRequests() {
        List<LeaveRequest> requests =
                leaveRequestRepository
                        .findByLeaveTypeIgnoreCaseOrderByStartDateAsc(
                                "annual"
                        );

        assertThat(requests)
                .extracting(LeaveRequest::getLeaveRequestId)
                .containsExactly(1, 4);
    }

    @Test
    void shouldFindOverlappingLeaveRequest() {
        List<LeaveRequest> requests =
                leaveRequestRepository.findOverlappingLeaveRequests(
                        11,
                        LocalDate.of(2026, 10, 11),
                        LocalDate.of(2026, 10, 13)
                );

        assertThat(requests)
                .extracting(LeaveRequest::getLeaveRequestId)
                .containsExactly(1);
    }

    @Test
    void shouldReturnNoLeaveOverlapOutsideRequestedDates() {
        List<LeaveRequest> requests =
                leaveRequestRepository.findOverlappingLeaveRequests(
                        11,
                        LocalDate.of(2026, 10, 13),
                        LocalDate.of(2026, 10, 15)
                );

        assertThat(requests).isEmpty();
    }
}